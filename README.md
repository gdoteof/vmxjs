###Quick start
See `examples` for examples on how to use this.



#vmxjs
The `$vmx` object contains some high level methods for intereaction with VMX.  The goal of vmxjs is to allow you to quickly create HTML based computer vision apps.

##Detectors, Models, Connections, oh my!

Using the VMX App Builder, you can train *models* for the visual objects you are interested in.  The *Vision Engine* runs either locally, or on the cloud, and runs *detectors* for the *models* you choose.  

We call these links between your application and the *detectors*, "connections".  
By default, the $vmx object is prepopulated with a single detector.  `$vmx.defaultDetector`.  You have to explicitly set a connection (which corresponds to a running detector on the *Vision Engine*.  

```javascript
var connectionUuid = "XXX-XXXX-XXXXXX-XXXX";
$vmx.defaultDetector.set_connection({id: connectionUuid}); 
```

Each detector has associated with it a connection, and an 'image stream'.  An ImageStream is any object which has a method `getImage`.  `getImage` can return 

 - base64 encoded image
 - http location of an image (must be accessible by the *Vision Engine*)
 - a path to an image on the local filesystem of the *Vision Engine*


Though we are often processing video, the *Vision Engine* works primarily on a frame-by-frame basis. By associating an `ImageStream` with a detector, our vision app will be able to track objects through time; which may be critical.

Again, you must explicitly associate an image stream with a detector.  Again, we provide a default ImageStream in the `$vmx` object, our default ImageStream is attached to a `<vmx-video>` custom element; which can get frames from your webcam, and provides a couple other options for input.

```javascript
// We do this for you by default, provided here for clarity if you wanted to use something other than defaultStream
$vmx.defaultDetector.setVideoSrc($vmx.defaultStream);
```

Once a detector has both a *connection* and an ImageStream; it can start detecting.  It's important to realize two things:

- Each request to the Vision Engine is an isolated snapshot in time, returning the metainfo for a particular frame
- We don't always have to think about the fact that each snapshot is isolated in time.

`$vmx.init()` is invoked when the default ImageStream (`$vmx.defaultStream`) is ready

```javascript
$vmx.init = function(){
  //This is the entry function, it is implemented by you to be called
  //when the defaultDetector has an image stream.
  $vmx.defaultDetector.setConnection{id: connectionId};
  $vmx.defaultDetector.start();
}
```

Once a detector is *running* the vmxApi object provides JQuery-like selectors for watching what your object does over time.

```javascript
var enterCallback = function(param) {
  alert (param); // will create alert box that says "vmx found my eyes!"
}
vmxApi("eyes").onEnter(enterCallback, "vmx found my eyes!", {minTime:3000});
```

There are a few things going on here:

- `vmxApi("eyes")`
  - `vmxApi` is the javascript object that contains high-level functions for dealing with visual objects
  - the `"eyes"` part is the *selector*.  It will return data referring to any *running detector* that has a model called "eyes"
- `onEnter`
  - `enterCallback` is a reference to a function that you want to run when "eyes" enters the visual field
  - The second argument to `onEnter` will be sent as an argument to the callback in the first paramater
    - `"vmx found my eyes!"` is an arbitrary argument to `enterCallback`. 
  - `{minTime: 3000}` is an option configuration argument to `onEnter`.  `minTime` refers to the minimum amount of time an object has been out of the visual field before it can be considered to have entered again.
    - this is an important point: if you have an expensive action you need to take when some particular thing enters the visual field, you don't want to do it again if the object gets occluded for a slight moment.


Any anytime, you can get the coordinates of the visual object; tracked in real time with client-side tracking.

```javascript
var coordinates = vmxApi("eyes").getSmooth();
//coordinates has x1, y1, x2, y2, representing the top left and bottom-right corners of the box associated with "eyes'
```

see `examples/coordinates.html` and `examples/coordinates.js` to see how to combine with this `window.requestAnimationFrame`
