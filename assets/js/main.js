const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = document.querySelector("header p"),
  closeIcon = document.querySelector("header i"),
  titleTag = document.querySelector("input"),
  descTag = document.querySelector("textarea"),
  addBtn = document.querySelector("button");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let checkUpdate = false,
  updateId;

// convert data from localStorage to JavaScript object
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

addBox.addEventListener("click", () => {
  titleTag.focus();
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  checkUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a new note";
  popupBox.classList.remove("show");
});

function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = `
        <li class="note">
            <div class="details">
            <p>${note.title}</p>
            <span
                >${note.description}
            </span>
            </div>
            <div class="bottom-content">
            <span>${note.date}</span>
            <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="menu">
                <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteNote(${index})" ><i class="uil uil-trash"></i>Delete</li>
                </ul>
            </div>
            </div>
        </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    // remove show class
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete?");
  if (!confirmDel) return;
  // remove selected note from array
  notes.splice(noteId, 1);
  //   update localStorage
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, desc) {
  updateId = noteId;
  checkUpdate = true;
  addBox.click();
  addBtn.innerText = "Update note";
  popupTitle.innerText = "Update a note";
  titleTag.value = title;
  descTag.value = desc;
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let noteTitle = titleTag.value,
    noteDesc = descTag.value;

  if (noteTitle || noteDesc) {
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`,
    };

    if (!checkUpdate) {
      notes.push(noteInfo);
    } else {
      checkUpdate = false;
      notes[updateId] = noteInfo;
    }

    // Saving notes to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    closeIcon.click();
    showNotes();
  }
});
