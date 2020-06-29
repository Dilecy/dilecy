#!/bin/sh
deps=`pwd`
rm -rf build sqlcipher
mkdir -p sqlcipher/include
mkdir build
cd build
# Fetch and build openssl
git clone https://github.com/openssl/openssl.git
cd openssl
git checkout OpenSSL_1_1_1d
./config
make -j8
cd ..
cp openssl/libcrypto.a $deps/sqlcipher
# Fetch sqlcipher
git clone https://github.com/sqlcipher/sqlcipher.git
cd sqlcipher
git checkout v4.2.0
# Configure sqlcipher
features='--enable-fts3 --enable-fts4 --enable-fts5 --enable-json1 --enable-rtree --disable-tcl'
config='--enable-tempstore=yes --enable-releasemode --enable-shared=no --enable-static=yes'  
cflags='-fPIC -DSQLITE_HAS_CODEC -I'$deps/sqlcipher
./configure $features $config CFLAGS="$cflags" LDFLAGS="$deps/sqlcipher/libcrypto.a"
# Build sqlcipher
make -j8
cp *.h $deps/sqlcipher/include
cp sqlcipher $deps/sqlcipher
cp .libs/libsqlcipher.a $deps/sqlcipher
# Cleanup
cd $deps
rm -rf build
