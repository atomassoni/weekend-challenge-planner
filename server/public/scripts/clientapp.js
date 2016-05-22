$(document).ready(function() {
    console.log('ready');
    getTasks();

    /**-------- EVENT LISTENERS --------**/
    $('#task-form').on('click', 'circle', postTask);
    $('#task-form').on('submit', postTask);


    /**-------- STYLING EVENT LISTENERS --------**/
    $('#task-form').find('circle').hover(highlightActive);
    $('#task-list').on('mouseenter mouseout', 'circle', highlightActive);




});

/**-------- UTILITY FUNCTIONS --------**/

function highlightActive() {
    $(this).prev().toggleClass('highlight-active');
}

function checkInput(string) {
    if (string.length == 0 || string.length > 160) {
        alert("make sure to fill in task, and remember, you're limited to 160 characters");
        return false;
    }
}

function getPetId(button) {
    // get the pet ID
    var petId = button.parent().data('petID');
    console.log('getPetId', petId);
    return petId;
}

/**-------- AJAX FUNCTIONS --------**/
function putPet(event) {
    event.preventDefault();

    var preparedData = dataPrep($(this));
    var petId = getPetId($(this));

    $.ajax({
        type: 'PUT',
        url: '/pets/' + petId,
        data: preparedData,
        success: function(data) {
            getPets();
        },
    });
}

function deletePet(event) {
    event.preventDefault();

    var petId = getPetId($(this));

    $.ajax({
        type: 'DELETE',
        url: '/pets/' + petId,
        success: function(data) {
            getPets();
        },
    });
}


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
                $container = $('<div class="task-item ' + completeText + '"><div>');
                $container.append('<div class="task-text">' + task.task + '</div>');
                $container.append('<div class="task-svg">' +
                    '<svg class="svg-button ' + circleCompleteText + '" height=50 width=50>' +
                    '<g>' +
                    '<text class="circle-symbol" x=17 y=33>&#x2713;</text>' +
                    '<circle cx=25 cy=25 r=24></circle>' +
                    '</g>' +
                    '</svg>' +
                    '<svg class="svg-button ' + circleCompleteText + '" height=50 width=50>' +
                    '<g>' +
                    '  <text class="circle-symbol" x=17 y=33>&#x2715;</text>' +
                    ' <circle cx=25 cy=25 r=24></circle>' +
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

    if (checkInput(task.task)!=false) {
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
    }
}
