#!/bin/sh
deps=`pwd`
rm -rf build sqlcipher
mkdir -p sqlcipher/include
mkdir build
cd build
# Fetch sqlcipher
git clone https://github.com/sqlcipher/sqlcipher.git
cd sqlcipher
git checkout v4.2.0
# Configure sqlcipher
features='--enable-fts3 --enable-fts4 --enable-fts5 --enable-json1 --enable-rtree --disable-tcl --with-crypto-lib=commoncrypto'
config='--enable-tempstore=yes --enable-releasemode --enable-shared=no --enable-static=yes'  
cflags='-fPIC -DSQLITE_HAS_CODEC -I'$deps/sqlcipher
./configure $features $config CFLAGS="$cflags" LDFLAGS="-framework Security -framework Foundation"
# Build sqlcipher
make -j8
cp *.h $deps/sqlcipher/include
cp sqlcipher $deps/sqlcipher
cp .libs/libsqlcipher.a $deps/sqlcipher
# Cleanup
cd $deps
rm -rf build
