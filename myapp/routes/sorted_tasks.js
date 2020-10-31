var express = require('express');
var router = express.Router();

/******************************** 
* 
*********************************/
router.get('/', function(req, res, next) {
//  res.send('respond with a resource-1234');
  var query = req.query;
  var page = 1;
  if(query.page != null){
      page = query.page
      console.log( "page=", page )
  }
  res.render('sorted_tasks/index', {"page": page });  
});
/******************************** 
* 
*********************************/
router.get('/new', function(req, res, next) {
    res.render('sorted_tasks/new', {});
});
/******************************** 
* 
*********************************/
router.get('/show/:id', function(req, res) {
console.log(req.params.id  );
    res.render('sorted_tasks/show', {"params_id": req.params.id });
});
/******************************** 
* 
*********************************/
router.get('/edit/:id', function(req, res) {
  console.log(req.params.id  );
      res.render('sorted_tasks/edit', {"params_id": req.params.id });
});
/******************************** 
* 
*********************************/
router.get('/import_task', function(req, res, next) {
    res.render('sorted_tasks/import_task', {});
});
/******************************** 
* 
*********************************/
router.get('/paging_index', function(req, res, next) {
    var query = req.query;
    var page = 1;
    if(query.page != null){
        page = query.page
        console.log( "page=", page )
    }
    res.render('sorted_tasks/paging_index', {"page": page });
});
/******************************** 
* 
*********************************/
router.get('/test', function(req, res, next) {
    res.render('sorted_tasks/test4', {});
});

module.exports = router;
