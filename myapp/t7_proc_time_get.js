
const { performance } = require('perf_hooks');
const { spawn } = require('child_process');

//
function test1(){
    var url = "http://localhost/api_sorted_tasks/tasks_index?page=1";

    var t0 = performance.now();
    const child = spawn('curl', [url]);

    child.stdout.on('data', (data) => {
        console.log('stdout data:', data.toString('utf8'));
//        console.log('stdout data:', "");
    });
    child.stderr.on('data', (data) => {
        console.error('stderr data:', data.toString('utf8'));
    });
    child.on('close', (code) => {
        console.log("on close:", code);
        var t1 = performance.now();
        console.log("Call to function took= " + (t1 - t0) + " milliseconds.");    
    }); 
}

/******************************** 
*  main
*********************************/
test1();


