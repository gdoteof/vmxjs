var SERVER = "http://localhost:3000/"

var myModelName = 'gesture_v';

$vmx.init = function(){

  var start = function(connectionUuid) {
    //We can have any number of running detectors, but for simplicity we have a default
    $vmx.defaultDetector.set_connection({id: connectionUuid}); 

    //Maybe superfluous explicit starting of the detector.
    $vmx.defaultDetector.start();

    // We refer to our detectors by name, as we might get new, improved models
    vmxApi(myModelName).onEnter(dosomething, {saying:'hi' }, {minTime:1000});
    vmxApi(myModelName).onLeave(dosomething, {saying:'bye' }, {minTime:1000});

  }

  var dosomething = function(data){
    meSpeak.speak(data.saying);
    console.log("Doing something with, ", data);
  }

  $vmx.models.list().then(function(x) {
    x = x.filter(function(x) { return x.name == myModelName; });
    if (x.length == 0) {
      console.log('no models matching',myModelName);
    } else {
      var myModelUuid = x[0].uuid;
      $vmx
        .connections
        .update()
        .then(function(runningDetectors){
          
          // Check all the running detectors for the model we are interested in
          for (var conn in runningDetectors){
            if (runningDetectors[conn].model.uuid == myModelUuid){
              // When one's found, start our thingy with existing connectionId
              start(runningDetectors[conn].id);
              return;
            }
          }
          
          // If we get here, we don't have an existing running detector for our model
          // So we make one, which happens asynchronously
          $vmx.connections.create(myModelUuid).then(function(connectionId){
            //Then we start our thingy with the new connectionId
            console.log('New connection created:',connectionId);
            start(connectionId);
          });
          
        });
    }
  });
};


