(function (win) {

  var storage = {};
  // console.log("storage内容:" + win.localStorage.getItem("todoStorage"));

  //存储记录
  storage.set = function (storageName,arr) {
    var str = JSON.stringify(arr);
    win.localStorage.setItem(storageName, str);
  };

  //获取所有记录
  storage.get = function (storageName) {
    var str = win.localStorage.getItem(storageName);
    var arr = JSON.parse(str);
    return arr;
  };

  //在前面添加一条记录
  storage.unshift = function (content) {
    var arr = storage.get() || [];
    arr.unshift({
      content: content,
      state: false,
      id: (new Date()).getTime()
    });
    storage.set(arr);
  };

  //删除一条记录
  // 参数id为要删除的记录id
  // 成功返回被删除记录的id
  // 失败返回false
  storage.remove = function (id) {
    var arr = storage.get();
    for (let i = 0; i <= arr.length; i++) {
      if (arr[i].id == id) {
        arr = arr.splice(i, 1);
        storage.set(arr);
        return id;
      }
    }
    return false;
  };

  //修改记录状态
  storage.switchState = function (id) {

    var arr = storage.get();

    arr.forEach(function (val) {
      if (val.d == id) {
        val.state = !val.state;
      }
    });

    storage.set(arr);
  };

  //修改某条记录的内容
  storage.edit = function (id, content) {
    var arr = get();
    arr.forEach(function (val) {
      if (val.d == id) {
        val.content = content;
        return val.id;
      }
    });
    return false;
  };

  //删除所有记录
  storage.removeAll = function () {
    storage.set([]);
  };

  win.storage = storage;

})(window);
