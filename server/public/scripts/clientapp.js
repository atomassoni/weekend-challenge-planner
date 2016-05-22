$(document).ready(function () {
console.log('ready');
//getTasks();

/**-------- STYLING EVENT LISTENERS --------**/
  $('#task-form').on('click', 'circle', postTask);


/**-------- STYLING EVENT LISTENERS --------**/
  $('#task-form').find('circle').hover(highlightActive);
  $('#task-list').on('mouseenter mouseout', 'circle', highlightActive);




});

/**-------- UTILITY FUNCTIONS --------**/

function highlightActive() {
  $(this).prev().toggleClass('highlight-active');
}

function checkInput (string) {
  if (string.length==0) {
    return;
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
    success: function (data) {
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
    success: function (data) {
      getPets();
    },
  });
}


function getTasks() {


  var complete = false;

  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function (tasks) {
      $svg = $('<div class="task-svg">' +
          '<svg class="svg-button" height=50 width=50>' +
                '<g>' +
                '<text class="circle-symbol" x=17 y=33>&#x2713;</text>' +
                      '<circle cx=25 cy=25 r=24></circle>' +
                  '</g>' +
              '</svg>' +
              '<svg class="svg-button" height=50 width=50>' +
                  '<g>' +
                    '<text class="circle-symbol" x=17 y=33>&#x2715;</text>' +
                    '<circle cx=25 cy=25 r=24></circle>' +
                '  </g>' +
              '</svg>' +
              '</div>');
      $('#task-list').empty();


      tasks.forEach(function (task) {

        $container = $('<div class="task-item"><div>');
        $container.append('<div class="task-text">' + task.task + '</div>');
        $container.append('<div class="task-svg">' +
            '<svg class="svg-button" height=50 width=50>' +
                  '<g>' +
                  '<text class="circle-symbol" x=17 y=33>&#x2713;</text>' +
                        '<circle cx=25 cy=25 r=24></circle>' +
                    '</g>' +
                '</svg>' +
                '<svg class="svg-button" height=50 width=50>' +
                    '<g>' +
                      '  <text class="circle-symbol" x=17 y=33>&#x2715;</text>' +
                      ' <circle cx=25 cy=25 r=24></circle>' +
                  '  </g>' +
                '</svg>' +
                '</div>');
        $('#task-list').append($container);
    });

  },
});

}

function postTask(event) {
  event.preventDefault();

  var task = {};
  //gathers the data from the form for task
  $.each($('#task-form').serializeArray(), function (i, field) {
    task[field.name] = field.value;
  });


  //sends the task information to the server via POST
  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: task,
    success: function (data) {
      console.log("success!");
      getTasks();
    },
  });
}
