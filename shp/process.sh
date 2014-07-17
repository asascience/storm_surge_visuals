get_files () {
  files="`ls | grep "\.shp$"`"
}

echo "process shp files to geoJson..."
get_files

for f in $files 
do
  echo "processing: $f"
  "`ogr2ogr -f GeoJSON -t_srs crs:84 $f.geojson $f`"
done
echo "done"