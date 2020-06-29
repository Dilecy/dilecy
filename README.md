# Dilecy
Dilecy's desktop client for macOS and Windows offers users features to identify organizations that might hold data on them. It can help identify organizations by matching the browser history with a provided database. Users can send data subject access requests (DSRs), objections to processing and requests for deletion via the user's email using SMTP or OAuth (for Gmail).

# Binaries
Prebuilt binaries for macOS and Windows can be downloaded from [our website](https://dilecy.eu/download/). 

# Development

## Requirements
- Supported OS (Windows or macOS)
- Git
- Node.js v10.17.0 or higher
- npm
- Yarn

## macOS
```
mkdir ~/code
cd ~/code
git clone git@github.com:Dilecy/dilecy.git
cd dilecy/deps
./buildDeps-macOS.sh
cd ~/code/dilecy
yarn install
yarn rebuild
yarn start
```

## Windows
- Run the following commands in an administrative PowerShell (installs chocolatey, git, node, vs2017 and dependencies)
```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco install git nodejs-lts yarn python openssl magicsplat-tcl-tk visualstudio2017buildtools -y
mkdir C:\Work
New-Item -ItemType SymbolicLink -Target "C:\Program Files\OpenSSL-Win64" -Path "C:\Work\OpenSSL-Win64"
```

- Open the Visual Studio Installer and modify Visual Studio Build Tools 2017.
- Select the Visual C++ Build Tools Workload
- Manually add C++/CLI support
- Click modify and grab a coffee (the installation takes a while)
- Restart Windows
- Open the x64 Native Command Prompt for Visual Studio 2017 and run the following commands
```
mkdir %userprofile%\code
cd %userprofile%\code
git clone git@github.com:Dilecy/dilecy.git
git clone https://github.com/sqlcipher/sqlcipher.git
cd %userprofile%\code\sqlcipher
git checkout v4.2.0
copy %userprofile%\code\dilecy\deps\sqlcipher-win-makefile Makefile.msc
nmake /f Makefile.msc
md %userprofile%\code\dilecy\deps\sqlcipher
md %userprofile%\code\dilecy\deps\sqlcipher\include
copy *.h %userprofile%\code\dilecy\deps\sqlcipher\include
copy libsqlite3.lib %userprofile%\code\dilecy\deps\sqlcipher
copy sqlite3.exe %userprofile%\code\dilecy\deps\sqlcipher
copy "C:\Program Files\OpenSSL-Win64\lib\VC\static\libcrypto64MT.lib" %userprofile%\code\dilecy\deps\sqlcipher
copy "C:\Program Files\OpenSSL-Win64\lib\VC\static\libssl64MT.lib" %userprofile%\code\dilecy\deps\sqlcipher

%userprofile%\code\dilecy
yarn install
yarn rebuild
yarn start
```

## Yarn commands
- `yarn rebuild` rebuilds the sqlite package by adding sqlcipher to it
- `yarn start` compiles and starts the app in development mode
- `yarn make` compiles and generates you a platform specific distributable
- `yarn tsc` compiles and checks the code for syntax and linting errors
- `yarn test` runs the test suite
- `yarn webdev` runs the browser environment which does not require sqlcipher and also does not persist any data
