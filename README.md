# showcase-climdex

### NetCDFs served

Geoserver, which serves the Climdex index NetCDF files as map tiles, expects EPSG:4327. At least, the NetCDFs are coded that way. But they actually have longitude 0:+360 with 0 on Greenwhich, when EPSG:4327 uses -180:+180. So we need to subtract 360 degrees from the longitudes in the range `(180, 360]`.

Okay, it looks like Geoserver supports lon > 180 and continuous longitudinal wrapping for WMS as of Geoserver version 2.10. But maybe not WCS... it may simply be that this is easier to serve through WMS (although I lose flexibility in terms of styling client-side). I might also be able to serve animated tiles via WMS, soooo...