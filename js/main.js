const LISTNAME = "tomsfuckintodolist";

let speed = 500;
let itemTemplate = $('#templates .toDoItem');
let list = $('#list');
let loadRequest = $.ajax({type:'GET',url:`https://listalous.herokuapp.com/lists/${LISTNAME}`});

function addItemToPage(itemData) {
  let item = itemTemplate.clone(true, true);
  item.attr('data-id', itemData.id);
  item.find('.description').text(itemData.description);
  if(itemData.completed) {
    item.addClass('completed');
  }
  item.hide();
  if(itemData.completed){
    list.append(item);
  } else{
    list.prepend(item);
  }
  item.fadeIn(speed);
}

loadRequest.done(function(dataFromServer){
  let itemsData = dataFromServer.items;
  itemsData.forEach(function(itemData) {
    addItemToPage(itemData);
  });
});

function creationAudio() {
  let audio = new Audio('audio/creationWow.mp3');
  audio.play();
}

function completedAudio() {
  let audio = new Audio('audio/completedWow.mp3');
  audio.play();
}

function undoAudio() {
  let audio = new Audio('audio/undoWow.mp3');
  audio.play();
}

function deleteAudio() {
  let audio = new Audio('audio/deleteSneeze.mp3');
  audio.play();
}

function resetAll() {
  $('.toDoList .toDoItem').each(function() {
    // Delete each 'this' element
    deleteItem($(this));
    clearForm();
  });
}

function completeAll() {
  $('.toDoList .toDoItem').each(function() {
    // Complete each 'this' element
    if (!($(this).hasClass('completed'))) {
      completeItem($(this));
    }
    clearForm();
  });
}

function undoAll() {
  $('.toDoList .toDoItem').each(function() {
    // Complete each 'this' element
    if ($(this).hasClass('completed')) {
      completeItem($(this));
      clearForm();
    }
    clearForm();
  });
}

// When the user hits "Enter" in the input field, submit an AJAX request to
// create the item.
$('#addForm').on('submit', function(event) {
  let itemDescription = event.target.itemDescription.value;
  event.preventDefault();

  if(itemDescription[0] === '/') {
    // Then we're in a command, so don't actually create a new list items

    let command = itemDescription.slice(1).toLowerCase();
    switch (command) {
      case 'resetall':
      case 'deleteall':
      case 'delete':
      case 'reset':
        resetAll();
        break;

      case 'completeall':
      case 'complete':
      case 'somethingsomethingsomethingcomplete':
        completeAll();
        break;

      case "undoall":
      case "undo":
      case "uncompleteall":
      case "redo":
        undoAll();
        break;

      default: alert(`Command not found ${command}`);

    }
  } else {
    let creationRequest = $.ajax({
      type: 'POST',
      url: `https://listalous.herokuapp.com/lists/${LISTNAME}/items`,
      data: {
        description: itemDescription,
        completed: false,
      }
    });

    creationRequest.done(function(itemDataFromServer) {
      addItemToPage(itemDataFromServer);
      clearForm();
      creationAudio();
    });
  }
});

$('.complete').click(function() {
  let item = $(this).parent();
  completeItem(item);
  if (item.hasClass('completed')) {
    undoAudio();
  } else {
    completedAudio();
  }
});

function clearForm() {
  $('#addForm')[0].reset();
}

function completeItem(item) {
  let isItemCompleted = item.hasClass('completed');
  let itemId = item.attr('data-id');

  let updateRequest = $.ajax({
    type: 'PUT',
    url: `https://listalous.herokuapp.com/lists/${LISTNAME}/items/${itemId}`,
    data: {
      completed: !isItemCompleted
    }
  });

  updateRequest.done(function(itemDataFromServer) {
    if(itemDataFromServer.completed) {
      item.addClass('completed').appendTo('#list');
    } else {
      item.removeClass('completed');
    }
  });
}

function deleteItem(item) {
  let itemId = item.attr('data-id');

  let deleteRequest = $.ajax({
    type: 'DELETE',
    url: `https://listalous.herokuapp.com/lists/${LISTNAME}/items/${itemId}`,
  });

  deleteRequest.done(function() {
    item.fadeOut(speed, function() {
      item.remove();
    });
  });
}

$('.delete').click(function() {
  let item = $(this).parent();
  deleteItem(item);
  deleteAudio();
});
