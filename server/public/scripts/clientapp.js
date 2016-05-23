$(document).ready(function() {
    console.log('ready');
    //populates all the database tasks to the DOM
    getTasks();

    /**-------- EVENT LISTENERS --------**/
    $('#task-form').on('click', 'circle', postTask);
    $('#task-form').on('submit', postTask);
    $('#task-list').on('click', 'circle.check', putTask);
    $('#task-list').on('click', 'circle.ex', deleteTask);


    /**-------- STYLING EVENT LISTENERS --------**/
    $('#task-form').find('circle').hover(highlightActive);
    $('#task-list').on('mouseenter mouseout', 'circle', highlightActive);

});


/**-------- STYLING FUNCTIONS --------**/
//highlights the text inside the circles to match the hover
function highlightActive() {
    $(this).prev().toggleClass('highlight-active');
}

/**-------- UTILITY FUNCTIONS --------**/
//returns true if item has already been checked, and false if it has not.
function toggleComplete(button) {
    if (button.parent().parent().hasClass('done')) {
        return false;
    } else {
        return true;
    }
}
//makes sure user doesn't enter empty task or task too big
function checkInput(string) {
    if (string.length == 0 || string.length > 160) {
        alert("Make sure to fill in task, and remember, you're limited to 160 characters.");
        return false;
    }
}

function getTaskId(button) {
    // get task ID
    var taskId = button.parent().parent().parent().parent().data('task_id');
    return taskId;
}

/**-------- AJAX FUNCTIONS --------**/
function putTask(event) {
    event.preventDefault();
    var preparedData = {
        'setCompleteAs': toggleComplete($(this))
    };
    var taskId = getTaskId($(this));

    $.ajax({
        type: 'PUT',
        url: '/tasks/' + taskId,
        data: preparedData,
        success: function(data) {
            getTasks();
        },
    });
}

//sets up a dialog to make sure you really want to delete the task from the database
function deleteTask(event) {
    event.preventDefault();

    if (confirm('Would you like to completely delete this task?')) {
        var taskId = getTaskId($(this));

        $.ajax({
            type: 'DELETE',
            url: '/tasks/' + taskId,
            success: function(data) {
                getTasks();
            },
        });
    }
}

//gets all the tasks from the database and appends them to the dom
function getTasks() {

    var completeText = '';
    var circleCompleteText = '';

    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(tasks) {

            $('#task-list').empty();

            tasks.forEach(function(task) {
                if (task.complete) {
                    completeText = 'complete';
                    circleCompleteText = 'done';
                }
                $container = $('<div class="task-item ' + completeText + '"><div>').data({
                    'task_id': task.id
                });

                $container.append('<div class="task-text">' + task.task + '</div>');
                $container.append('<div class="task-svg">' +
                    '<svg class="svg-button ' + circleCompleteText + '" height=50 width=50>' +
                    '<g>' +
                    '<text class="circle-symbol" x=17 y=33>&#x2713;</text>' +
                    '<circle cx=25 cy=25 r=24 class="check"></circle>' +
                    '</g>' +
                    '</svg>' +
                    '<svg class="svg-button ' + circleCompleteText + '" height=50 width=50>' +
                    '<g>' +
                    '   <text class="circle-symbol" x=17 y=33>&#x2715;</text>' +
                    '   <circle cx=25 cy=25 r=24 class="ex"></circle>' +
                    '  </g>' +
                    '</svg>' +
                    '</div>');
                $('#task-list').append($container);
                completeText = '';
                circleCompleteText = '';
            });

        },
    });
}

function postTask(event) {
    event.preventDefault();

    var task = {};
    //gathers the data from the form for task
    $.each($('#task-form').serializeArray(), function(i, field) {
        task[field.name] = field.value;
    });

    if (checkInput(task.task) != false) {
        //sends the task information to the server via POST
        $.ajax({
            type: 'POST',
            url: '/tasks',
            data: task,
            success: function(data) {
                console.log("success!");
                getTasks();
            },
        });
        $('#task-form').find('input[type=text]').val('');
        
    }
}
