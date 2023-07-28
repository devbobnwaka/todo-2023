var toDoCtrl = (function (){
    var Todo, storeTodo, todoArr, calID;

    Todo = function (id, list, status){
        this.id = id;
        this.list = list;
        this.status = status;
    }

    Todo.prototype.toggleStatus = function(){
        if(this.status == 'pending'){
            this.status = 'completed';
        } else {
            this.status = 'pending';
        }
    }

    Todo.prototype.getStatus = function(){
        return this.status;
    }

    todoArr = []

    calID = function(arr){
        if(arr.length > 0){
            var id = arr[arr.length-1].id + 1;
        } else {
            var id = 0;
        }
        return id;
    }

    storeTodo = function(list, arr){
        var id = calID(arr)
        newTodo = new Todo(id, list, 'pending')
        arr.push(newTodo);
        return newTodo
    }

    return {
        getTodoArr: function () {
            return todoArr;
        },
        storeTodo: function(list, arr){
            return storeTodo(list, arr);
        },
        deleteTodo: function(id, arr){
            var index;
            index = arr.findIndex(e => e.id == id);
            arr.splice(index, 1);
        },
        toggleStatus: function (id, arr){
            var item;
            item = arr.find(e => e.id == id);
            item.toggleStatus()
        },
        getStatus: function(id, arr){
            var item;
            item = arr.find(e => e.id == id);
            return item.status
        }
    }
})()


var uiCtrl = (function (){
    var domString,  addListItem;

    domString = {
        add : '.add',
        todo: '#todo',
        todoSectionList:'.todo-section-list',
        status: '.status',
    }

    addListItem = function(obj){
        var html, el, newHtml;
        html = '<div class="todos todo-row" id="%id%"><span class="todo-list">%list%</span><span class="todo-status"><button type="button" class="status">%status%</button></span><span class="todo-close"><button type="button" class="delete ddd" >delete</button></span></div>';
  
        // replace dynamic contents
        newHtml = html.replace("%list%", obj.list);
        newHtml = newHtml.replace("%status%", obj.status);
        newHtml = newHtml.replace("%id%", obj.id);
        el = document.querySelector(domString.todoSectionList)
        el.insertAdjacentHTML('afterbegin', newHtml);
    }

    var getData = function (domString) {
        var value = document.querySelector(domString.todo).value
        return value
    }

    return {
        domString: function () {
            return domString
        },
        getData: function (domString) {
            return getData(domString)
        },
        addListUi:function(obj){
            return addListItem(obj)
        },
        getItemID: function(e){
            return e.target.parentNode.parentNode.id;   
        },
        clearField: function(){
            var field;
            field = document.querySelector(domString.todo)
            field.value = "";
            field.focus();
        },
        removeItem: function(e, id){
            var item;
            item = e.target.parentNode.parentNode;
            item.remove(id)
        },
        displayStatus: function(e, status){
            var curStatus;
            e.target.textContent = status
            curStatus = e.target.textContent
            e.target.classList.toggle('completed')
            
        }
    }
})()

var controller = (function (toDoCtrl, uiCtrl){
    var domString, addTodoElement;

    domString = uiCtrl.domString();
    addTodoElement = document.querySelector(domString.add);
    el = document.querySelector(domString.todoSectionList);
    statusEl = document.querySelector(domString.status);

    function setUpEventlistener(){
        addTodoElement.addEventListener("click", addTodo);
        addTodoElement.addEventListener("submit", addTodo);
        el.addEventListener("click", button);
    }

    function delButton(e){
        var is_delete, itemID, todoArr;
        is_delete = e.target.classList.contains('delete');
        if(is_delete){
            // get itemID , arr
            itemID = uiCtrl.getItemID(e);
            todoArr = toDoCtrl.getTodoArr();
            // delete item from data structure
            toDoCtrl.deleteTodo(itemID, todoArr)
            // remove from ui
            uiCtrl.removeItem(e, itemID);
        }
    }

    function statusButton(e){
        var is_status, itemID, todoArr, status;
        is_status = e.target.classList.contains('status');
        if(is_status){
            // get itemID , arr
            itemID = uiCtrl.getItemID(e);
            todoArr = toDoCtrl.getTodoArr();
            // update in data structure
            toDoCtrl.toggleStatus(itemID, todoArr)
            status = toDoCtrl.getStatus(itemID, todoArr);
            // update in ui
            uiCtrl.displayStatus(e, status);
        }
    }

    function button(e){
        delButton(e);
        statusButton(e);
    }

    function addTodo(event) {
        event.preventDefault()
        if(uiCtrl.getData(domString) != ""){
            // get data from ui
            var value = uiCtrl.getData(domString);
            // get current todo arr
            var todoArr = toDoCtrl.getTodoArr();
            // store value in data structure
            var newTodo = toDoCtrl.storeTodo(value, todoArr);
            // display data in ui
            uiCtrl.addListUi(newTodo);
            // clear ui
            uiCtrl.clearField()
        }
    }
    


    return {
        init:function(){
            return setUpEventlistener();
        }
    }
})(toDoCtrl, uiCtrl)

controller.init();