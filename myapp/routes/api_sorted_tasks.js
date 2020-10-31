var express = require('express');
var router = express.Router();
const redis = require("redis");
const {promisify} = require('util');
//const client = redis.createClient();
const config = {
    host: 'redis',
    port: 6379
}
const client = redis.createClient(config)

import LibSortedTasks from "../libs/LibSortedTasks"
import LibCommon from "../libs/LibCommon"
import LibPagenate from "../libs/LibPagenate"

const mgetAsync = promisify(client.mget).bind(client);
const zrevrangeAsync = promisify(client.zrevrange).bind(client);
//
router.get('/', function(req, res, next) {
    res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/tasks_index',async function(req, res) {
    var ret_arr = {ret:0, msg:""}
    var query = req.query;
    var page = query.page;
console.log( "page=",  page );
    LibPagenate.init();
//    LibPagenate.set_per_page(10);
    var page_info = LibPagenate.get_page_start(page);
    client.on("error", function(error) {
        console.error(error);
        ret_arr.msg = error
        res.json(ret_arr);
    });
    try{
        var data = await zrevrangeAsync("sorted_tasks", page_info.start, page_info.end );
        var reply_books = await mgetAsync(data);
//console.log( data.length );
        var paginate_disp = LibPagenate.is_paging_display(data.length)
// console.log( "paginate_disp:", paginate_disp);
        const task_items = LibCommon.string_to_obj(reply_books)
        var page_item = {
            "item_count":data.length ,"paginate_disp": paginate_disp
        }
        var param = {
             "docs": task_items ,
             "page_item": page_item,            
        };
        res.json(param); 
    } catch (e) {
        console.log(e);
        ret_arr.msg = e
        res.json(ret_arr);
    }
});

/*
router.get('/tasks_index',async function(req, res) {
    var ret_arr = {ret:0, msg:""}
    client.on("error", function(error) {
        console.error(error);
        ret_arr.msg = error
        res.json(ret_arr);
    });
    try{
        var data = await zrevrangeAsync("sorted_tasks", 0, -1 );
        var reply_books = await mgetAsync(data);
        const task_items = LibCommon.string_to_obj(reply_books)
        var param = {"docs": task_items };
        res.json(param); 
    } catch (e) {
        console.log(e);
        ret_arr.msg = e
        res.json(ret_arr);
    }
});
*/

/******************************** 
* 
*********************************/
router.get('/tasks_show/:id', function(req, res, next) {
    console.log(req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    client.get(req.params.id, function(err, reply_get) {
        console.log(reply_get );
        var row = JSON.parse(reply_get || '[]')
        var param = {"docs": row };
        res.json(param); 
    });        

});
/******************************** 
* 
*********************************/
router.post('/tasks_new', function(req, res, next){
    let data = req.body
//    console.log( data );
    var key_idx  = "idx-task";
    var key_head  = "task:";
    var key_sorted  = "sorted_tasks";
    client.on("error", function(error) {
        console.error(error);
    });    
    client.incr(key_idx, function(err, reply) {
        var key = key_head + String(reply)
        console.log( key );
        client.zadd(key_sorted , reply , key );
        var item = {
            title: data.title ,  
            content: data.content ,
            id: key,
        };
        var json = JSON.stringify( item );
        client.set(key , json , function() {
            var param = {"ret": 1 };
            res.json(param); 
        });
    });      
});
/******************************** 
* 
*********************************/
router.post('/tasks_update', function(req, res, next){
    let data = req.body
console.log( data );
    client.on("error", function(error) {
        console.error(error);
    });
    var key = data.id;
    var item = {
        title: data.title ,  
        content: data.content ,
        id: data.id,
    };
    var json = JSON.stringify( item );
//console.log( json );
    client.set(key , json , function() {
        var param = {"ret": 1 };
        res.json(param);
    });
});
/******************************** 
* 
*********************************/
router.get('/tasks_delete/:id', function(req, res, next){
    let data = req.body
console.log( req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    var key_sorted  = "sorted_tasks";  
    client.zrem(key_sorted , req.params.id , function() {
        var param = {"ret": 1 };
        res.json(param);
    });
});
/******************************** 
* 
*********************************/
router.post('/file_receive', function(req, res, next) {
    let data = req.body
    var items = JSON.parse(data.data || '[]')
    var ret_arr = {ret:0, msg:""}
    client.on("error", function(error) {
        console.error(error);
        ret_arr.msg = error
        res.json(ret_arr);
    });  
//console.log( items )
    var ret = LibSortedTasks.add_items(client, items);
    var param = {"ret": ret };
    res.json(param);
});
module.exports = router;
