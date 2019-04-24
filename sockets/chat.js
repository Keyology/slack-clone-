module.exports = (io, socket, onlineUsers, channels) => {
  console.log("Connected!");

  socket.on("new user", username => {
    onlineUsers[username] = socket.id;
    socket["username"] = username;
    console.log(`${username} has joined the chat!`);
    io.emit("new user", username);
  });
  socket.on("new channel", newChannel => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    //Have the socket join the new channel room.
    socket.join(newChannel);
    //Inform all clients of the new channel.
    io.emit("new channel", newChannel);
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  //   socket.on("new message", data => {
  //     console.log(`!${data.sender}: ${data.message}!`);
  //     io.emit("new message", data);
  //   });

  socket.on("user changed channel", newChannel => {
    socket.join(newChannel);
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  socket.on("new message", data => {
    //Save the new message to the channel.
    channels[data.channel].push({ sender: data.sender, message: data.message });
    //Emit only to sockets that are in that channel room.
    io.to(data.channel).emit("new message", data);
  });
  socket.on("new channel", newChannel => {
    console.log(newChannel);
  });

  socket.on("get online users", () => {
    socket.emit(`get online users`, onlineUsers);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.username];
    io.emit("user has left", onlineUsers);
  });
};
