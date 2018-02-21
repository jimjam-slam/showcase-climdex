# showcase-climdex

### NetCDFs served

Geoserver, which serves the Climdex index NetCDF files as map tiles, espects EPSG:4327. At least, the NetCDFs are coded that way. But they actually have longitude 0:+360 with 0 on Greenwhich, when EPSG:4327 uses -180:+180. So we need to subtract 360 degrees from the longitudes in the range `(180, 360]`.

~~[The Climate Cryosphere Wiki](http://www.climate-cryosphere.org/wiki/index.php?title=Regridding_with_CDO#Convert_Longitudes_from_E.2FW_convention_to_0-360_convention) describes the reverse process, so I think I could be able to do it in NCO using:~~

```
ncap2 -s 'where(lon>180) lon=lon-360' -o infile.nc outfile.nc
```

Nope, that didn't work 😒

~~Okay, I can use CDO. If I check the existing grid using `cdo sinfon`, I can write a grid description file like:~~

```
gridtype = lonlat
xsize    = 192
xfirst   = -180
xinc     = 1.875
ysize    = 145
yfirst   = -90
yinc     = 1.25
```

~~Then regridding with `cdo setgrid,mygrid infile.nc outfile.nc`. But I have to pull those attributes out, which means either doing it manually or learning a bit more CDO so I can automatically pull those values out.~~

That didn't work either 😒

If I learned a bit of NCL, I could also do it in one easy go with [`lonFlip`](https://www.ncl.ucar.edu/Document/Functions/Contributed/lonFlip.shtml).
