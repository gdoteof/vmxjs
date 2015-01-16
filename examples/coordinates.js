var SERVER = "http://localhost:3000/"



$vmx.init = function(){

  var start = function(connectionUuid) {
    //We can have any number of running detectors, but for simplicity we have a default
    $vmx.defaultDetector.set_connection({id: connectionUuid}); 

    //Maybe superfluous explicit starting of the detector.
    $vmx.defaultDetector.start();

    // We refer to our detectors by name, as we might get new, improved models
    vmxApi("eyes").onEnter(dosomething, {some: {arbitrary: "data"}}, {minTime:3000});

    var draw = function (){
      window.requestAnimationFrame(draw);
      var trackingInfo = vmxApi("eyes").getSmooth();
      if (trackingInfo){
        $("#output").html("x: " + Math.round(trackingInfo.x) + ", y: " + Math.round(trackingInfo.y));
        for (var i in trackingInfo){
          $("#output").append("<pre>" + i + ": " + JSON.stringify(trackingInfo[i]) + "</pre>");
        }
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
    // This is the UUID for the model I created which I called "eyes"
    var myModelUuid = 'b2730105-5a62-4b51-9973-119a10bd3995';

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



