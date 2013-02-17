#/bin/sh

# don't launch directly this script
# use 'make install-test100' to do so

PGBIN=/usr/lib/postgresql/9.1/bin
PGSHARE=/usr/share/postgresql/9.1/contrib/postgis-2.0
PGUSER=postgres
DB=tinyows_test

echo "Create Spatial Database: $DB"
su $PGUSER -c "$PGBIN/dropdb $DB > /dev/null"
su $PGUSER -c "$PGBIN/createdb $DB"
su $PGUSER -c "$PGBIN/createlang plpgsql $DB"
su $PGUSER -c "$PGBIN/psql $DB < $PGSHARE/postgis.sql"
su $PGUSER -c "$PGBIN/psql $DB < $PGSHARE/spatial_ref_sys.sql"
su $PGUSER -c "$PGBIN/psql $DB < test/wfs_100/ogc_wfs_sf0.sql"
