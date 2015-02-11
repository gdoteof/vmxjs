var SERVER = "http://localhost:3000/"
var myModelUuid = '5bfd969f-2c7a-4a2f-9a2f-e16deb0c388b';
var modelName = "eyess";



$vmx.init = function(){

  var start = function(connectionUuid) {
    //We can have any number of running detectors, but for simplicity we have a default
    $vmx.defaultDetector.set_connection({id: connectionUuid}); 

    //Maybe superfluous explicit starting of the detector.
    $vmx.defaultDetector.start();

    // We refer to our detectors by name, as we might get new, improved models
    vmxApi(modelName).onEnter(dosomething, {some: {arbitrary: "data"}}, {minTime:3000});

    var draw = function (){
      window.requestAnimationFrame(draw);
      var trackingInfo = vmxApi(modelName).getSmooth();
      if (trackingInfo){
        $("#output").html("x: " + Math.round(trackingInfo.x) + ", y: " + Math.round(trackingInfo.y));
      }
    }
    window.requestAnimationFrame(draw);
  }

  var dosomething = function(data){
    console.log("Doing something with, ", data);
  }


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



