const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function findUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  const i = users.findIndex((user) => user.id === id);
  if (i !== -1) {
    return users.splice(i, 1)[0];
  }
}

//Get Room User
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  findUser,
  userLeave,
  getRoomUsers,
};
