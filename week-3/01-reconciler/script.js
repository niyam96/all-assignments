
// What are u looking for?
// You'll get it on Friday you lazy porson

function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  // Get the current children of the parent element and convert it to an array
  var currentChildren = Array.from(parentElement.children);

  // Process each item in the data array
  data.forEach(function(item) {
    // Check if a child with this ID already exists
    var existingChild = currentChildren.find(function(child) {
      return child.dataset.id === String(item.id);
    });

    if (existingChild) {
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(function(child) {
        return child !== existingChild;
      });
    } else {
      // If it doesn't exist, create it
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete"
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);
    }
  });

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach(function(child) {
    parentElement.removeChild(child);
  });
}

function updateDomTree(data)
{
  var parentElement = document.getElementById("mainArea");
  var children = Array.from(parentElement.children);

  var currentIds = [];
  children.forEach(child => {
    currentIds.push(child.dataset.id)
  });

  var currentSet = new Set(currentIds);
  var newSet = new Set(data.map(todo => todo.id));
  
  //Creation list is elements in new set that are not in current DOM
  //Updation list is elements that are present in both sets
  //Removal list is elements in current DOM that are not in new set
  var creationList = [...newSet].filter(newId => !currentSet.has(newId));
  var updationList = [...currentSet].filter(currentId => newSet.has(currentId));
  var deletionList = [...currentSet].filter(currentId => !newSet.has(currentId));

  //Update elements that are already present in the current DOM
  updationList.forEach(id => {
    var childElement = document.querySelector(`[data-id='${id}'`);

    childElement.children[0].innerHTML = data[id-1].title;
    childElement.children[1].innerHTML = data[id-1].description;
  });

  //Create elements that aren't present in current DOM
  var fragment = new DocumentFragment();

  creationList.forEach(id => {
     var childElement = document.createElement("div");
     childElement.dataset.id = id; // Store the ID on the element for future lookups

     var grandChildElement1 = document.createElement("span");
     grandChildElement1.innerHTML = data[id-1].title;

     var grandChildElement2 = document.createElement("span");
     grandChildElement2.innerHTML = data[id-1].description

     var grandChildElement3 = document.createElement("button");
     grandChildElement3.innerHTML = "Delete"
     grandChildElement3.setAttribute("onclick", "deleteTodo(" + id + ")")

     childElement.appendChild(grandChildElement1)
     childElement.appendChild(grandChildElement2)
     childElement.appendChild(grandChildElement3)
     fragment.appendChild(childElement);
  });
  //Append the fragment to the parent div now
  parentElement.appendChild(fragment);

  //Remove elements that aren't present in new list
  deletionList.forEach(id => {
    var childElement = document.querySelector(`[data-id='${id}'`);
    parentElement.removeChild(childElement);
  });

}


window.setInterval(() => {
  let todos = [];

  var numberOfTodos = Math.floor(Math.random() * 100);
  console.log(`# of TODOS : ${numberOfTodos}`);

  for (let i = 0; i < numberOfTodos; i++) {
    todos.push({
      title: `Title : ${i+1}`,
      description: ` Description : ${i+1}`,
      id: i+1
    })
  }

  console.time("reconciler");
  updateDomTree(todos);
  //createDomElements(todos);
  console.timeEnd("reconciler");
}, 5000)
