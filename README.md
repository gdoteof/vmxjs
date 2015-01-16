###Quick start
See `examples` for examples on how to use this.



#vmxjs
The `$vmx` object contains some high level methods for intereaction with VMX.  The goal of vmxjs is to allow you to quickly create HTML based computer vision apps.

##Detectors, Models, Connections, oh my!

Using the VMX App Builder, you can train *models* for the visual objects you are interested in.  The *Vision Engine* runs either locally, or on the cloud, and runs *detectors* for the *models* you choose.  

We call these links between your application and the *detectors*, "connections".  
By default, the $vmx object is prepopulated with a single detector.  `$vmx.defaultDetector`.  You have to explicitly set a connection (which corresponds to a running detector on the *Vision Engine*.  

```
var connectionUuid = "XXX-XXXX-XXXXXX-XXXX";
$vmx.defaultDetector.set_connection({id: connectionUuid}); 
```


Though we are often processing video streams, VMX works primarily on a frame-by-frame basis.

