// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');



// Include Nodejs' net module.
const Net = require('net');
// The port on which the server is listening.
const port = 6666;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('dltmessagelocator.helloWorld', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        console.log('Hello World from &#34;DltMessageLocator&#34;!');
    });

    context.subscriptions.push(disposable);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dltmessagelocator" is now active!');

    createserver();

}

function createserver() {
    // Use net.createServer() in your code. This is just for illustration purpose.
    // Create a new TCP server.
    const server = new Net.Server();
    // The server listens to a socket for a client to make a connection request.
    // Think of a socket as an end point.

    server.listen(port, function () {
        console.log(`Server listening for connection requests on socket localhost:${port}`);
    });

    // When a client requests a connection with the server, the server creates a new
    // socket dedicated to that client.
    server.on('connection', function (socket) {
        console.log('A new connection has been established.');

        // Now that a TCP connection has been established, the server can send data to
        // the client by writing to its socket.
        socket.write('Hello, client.');

        // The server can also receive data from the client by reading from its socket.
        socket.on('data', function (chunk) {
            vscode.commands.executeCommand('workbench.action.findInFiles', {
                "query": chunk.toString().trimEnd(),
                "isRegex": true,
                "isCaseSensitive": false,
                "matchWholeWord": false,
                "preserveCase": false,
                "excludeSettingAndIgnoreFiles": true,
                "triggerSearch": true,
                "onlyOpenEditors": false,
                // "replace": "",
                // "filesToExclude": "",
                "filesToInclude": "*.c,*.cpp,*.h,*.hpp,*.cc",
            }).then( async function () {
                console.log("OKAYZ");

                await vscode.commands.executeCommand('list.focusPageUp');
                await sleep(200);
                await vscode.commands.executeCommand('workbench.action.keepEditor');
                // vscode.commands.executeCommand('search.action.openInEditor');
                // await vscode.commands.executeCommand('searchOpenAllResults.open');
                await sleep(200);

                await vscode.commands.executeCommand('search.action.focusNextSearchResult').then(function () {
                    console.log(`rrrrrrrrrrr: "000000000000000k"`);
                }, err => {
                    console.error(`Error: ${err}`);
                });
                await sleep(200);

            }, err => {
                console.error(err);
            })

            console.log(`>>>>>>>> ${chunk.toString().trimEnd()}`);
        });

        // When the client requests to end the TCP connection with the server, the server
        // ends the connection.
        socket.on('end', function () {
            console.log('Closing connection with the client');
        });

        // Don't forget to catch error, for your own sake.
        socket.on('error', function (err) {
            vscode.window.showInformationMessage(`Error: ${err}`);
        });
    });
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}