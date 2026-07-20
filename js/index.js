// I also fully documented this js file so i can explain everything i did well :)
/*    ContactHub   */

// strict sets the js itselff to a mode where it stricts your mistakes or bugs by showing more errors
(function () {
  "use strict";
  var STORAGE_KEY = "contacthub_contacts";
  var DEFAULT_AVATAR =
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg";

  //  State
  // shows the saved contacts if there were any in the storage
  var contacts = loadContacts();
  var editingId = null;

  //  DOM references
  var form = document.getElementById("addContactForm");
  var modalEl = document.getElementById("addContactModal");
  var modal = new bootstrap.Modal(modalEl);
  var modalTitle = document.getElementById("addContactModalLabel");
  var saveBtn = document.getElementById("saveContactBtn");

  var fullNameInput = document.getElementById("fullName");
  var phoneInput = document.getElementById("phoneNumber");
  var emailInput = document.getElementById("emailAddress");
  var addressInput = document.getElementById("address");
  var groupInput = document.getElementById("group");
  var notesInput = document.getElementById("notes");
  var favoriteCheck = document.getElementById("favoriteCheck");
  var emergencyCheck = document.getElementById("emergencyCheck");
  var photoInput = document.getElementById("photoInput");
  var photoPreview = document.querySelector(".photo-preview");

  var searchInput = document.getElementById("searchInput");
  var contactsList = document.getElementById("contactsList");
  var emptyState = document.getElementById("emptyState");
  var contactsSubtitle = document.getElementById("contactsSubtitle");
  var template = document.getElementById("contactCardTemplate");

  var totalCount = document.getElementById("totalCount");
  var favoritesCount = document.getElementById("favoritesCount");
  var emergencyCount = document.getElementById("emergencyCount");
  var favoritesList = document.getElementById("favoritesList");
  var emergencyList = document.getElementById("emergencyList");
  var favoritesEmpty = document.getElementById("favoritesEmpty");
  var emergencyEmpty = document.getElementById("emergencyEmpty");

  var selectedPhotoData = null;

  //  Storage helpers functions
  function loadContacts() {
    var raw = localStorage.getItem(STORAGE_KEY);
    // if nothing was saved before (raw is null), just start with an empty
    // list instead of trying to parse nothing
    if (raw) {
      return JSON.parse(raw);
    } else {
      return [];
    }
  }

  // storage function to save the contact into the browser localstorage
  function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }

  //  Validation
  // regex for every input field
  var namePattern = /^[A-Za-z\s]{2,50}$/;
  var phonePattern = /^01[0125][0-9]{8}$/;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // validate the form inputs and add/remove the "is-invalid" class based on the regex validation result
  function validateForm() {
    var valid = true;

    if (!namePattern.test(fullNameInput.value.trim())) {
      fullNameInput.classList.add("is-invalid");
      valid = false;
    } else {
      fullNameInput.classList.remove("is-invalid");
    }

    if (!phonePattern.test(phoneInput.value.trim())) {
      phoneInput.classList.add("is-invalid");
      valid = false;
    } else {
      phoneInput.classList.remove("is-invalid");
    }

    var email = emailInput.value.trim();
    if (email !== "" && !emailPattern.test(email)) {
      emailInput.classList.add("is-invalid");
      valid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    return valid;
  }

  [fullNameInput, phoneInput, emailInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });

  //  Photo upload preview
  photoInput.addEventListener("change", () => {
    var file = photoInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = (e) => {
      selectedPhotoData = e.target.result;
      photoPreview.style.backgroundImage = `url(${selectedPhotoData})`;
      photoPreview.style.backgroundSize = "cover";
      photoPreview.style.backgroundPosition = "center";
      photoPreview.innerHTML = "";
    };
    reader.readAsDataURL(file);
  });

  //  Reset form
  // reset the form inputs and state when the modal is closed or when a new contact is being added
  function resetForm() {
    form.reset();
    editingId = null;
    selectedPhotoData = null;
    photoPreview.style.backgroundImage = "";
    photoPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
    modalTitle.textContent = "Add New Contact";
    saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Contact';
    [fullNameInput, phoneInput, emailInput].forEach((i) =>
      i.classList.remove("is-invalid"),
    );
  }

  // fills the form inputs with the contact data when editing an existing contact
  function populateForm(contact) {
    fullNameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email || "";
    addressInput.value = contact.address || "";
    groupInput.value = contact.group || "";
    notesInput.value = contact.notes || "";
    favoriteCheck.checked = !!contact.favorite;
    emergencyCheck.checked = !!contact.emergency;
    selectedPhotoData = contact.photo || null;
    if (selectedPhotoData) {
      photoPreview.style.backgroundImage = `url(${selectedPhotoData})`;
      photoPreview.style.backgroundSize = "cover";
      photoPreview.style.backgroundPosition = "center";
      photoPreview.innerHTML = "";
    }
    modalTitle.textContent = "Edit Contact";
    saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Update Contact';
  }
  // reset the form when the modal is hidden (closed)
  modalEl.addEventListener("hidden.bs.modal", resetForm);

  //  Save (create / update)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // prevents the page to restart
    if (!validateForm()) return;
    if (editingId) {
      var contact = contacts.find((c) => c.id === editingId);
      // updates the object in place rather than replacing it with a new one. That matters because contact is the actual object sitting inside the contacts array — if you did contact = {...} instead, you would just be reassigning the local variable contact to a new object, and the array would still be pointing at the old, unedited one. Object.assign mutates the same object the array already references, so the edit shows up correctly everywhere.
      Object.assign(contact, {
        name: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        address: addressInput.value.trim(),
        group: groupInput.value,
        notes: notesInput.value.trim(),
        favorite: favoriteCheck.checked,
        emergency: emergencyCheck.checked,
        photo: selectedPhotoData || contact.photo,
      });
    } else {
      contacts.push({
        id: Date.now().toString(),
        name: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        address: addressInput.value.trim(),
        group: groupInput.value,
        notes: notesInput.value.trim(),
        favorite: favoriteCheck.checked,
        emergency: emergencyCheck.checked,
        photo: selectedPhotoData || DEFAULT_AVATAR,
      });
    }

    saveContacts();
    renderAll();
    modal.hide();
  });

  //  Render
  function renderAll() {
    renderContactsList(searchInput.value.trim().toLowerCase());
    renderSidebar();
    renderStats();
  }

  // updates the three stat numbers at the top of the page and the subtitle line under "All Contacts"
  function renderStats() {
    totalCount.textContent = contacts.length;
    favoritesCount.textContent = contacts.filter((c) => c.favorite).length;
    emergencyCount.textContent = contacts.filter((c) => c.emergency).length;
    contactsSubtitle.textContent = `Manage and organize your ${contacts.length} contact${contacts.length === 1 ? "" : "s"}`;
  }

  // fixed palette the avatar squares rotate through
  var AVATAR_COLORS = [
    "#059669",
    "#2563EB",
    "#7C3AED",
    "#F59E0B",
    "#EF4444",
    "#0891B2",
    "#DB2777",
  ];

  // takes a full name and returns up to two capital letters to show on the
  // avatar square (example "Ahmed Wael" --> "AW"
  function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    var initials = parts[0].charAt(0);
    if (parts.length > 1) {
      initials += parts[1].charAt(0);
    }
    return initials.toUpperCase();
  }

  // turns a contact's name into one of AVATAR_COLORS, always picking the same
  // color for the same name by summing up the character codes and using that
  // as an index
  function getAvatarColor(name) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  // remove the previously rendered row wrapper entirely (not just the
  // cards inside it) — leaving an empty ".contact-col-wrapper" behind 
  function renderContactsList(filterText) {
    contactsList
      .querySelectorAll(".contact-col-wrapper")
      .forEach((el) => el.remove());

    // filter the contacts based on the search input value, checking if the name, phone, or email includes the filter text
    var filtered = contacts.filter((c) => {
      if (!filterText) return true;
      return (
        c.name.toLowerCase().includes(filterText) ||
        c.phone.toLowerCase().includes(filterText) ||
        (c.email && c.email.toLowerCase().includes(filterText))
      );
    });

    if (filtered.length === 0) {
      emptyState.classList.remove("d-none");
      return;
    }
    emptyState.classList.add("d-none");

    // wrap the cards in a single row so they can wrap to the next line as needed, instead of each card being its own row and always taking up the full width
    var row = document.createElement("div");
    row.className = "row g-3 contact-col-wrapper";

    filtered.forEach((contact) => {
      var node = template.content.cloneNode(true);
      var col = node.querySelector(".contact-col");

      // avatar square shows the contact's initials on a color picked from
      // their name, instead of a photo — matches the card design
      var avatarEl = node.querySelector(".contact-avatar-initials");
      avatarEl.textContent = getInitials(contact.name);
      avatarEl.style.backgroundColor = getAvatarColor(contact.name);

      node.querySelector(".contact-name").textContent = contact.name;
      node.querySelector(".contact-phone-text").textContent = contact.phone;

      if (contact.email) {
        node.querySelector(".contact-email-row").classList.remove("d-none");
        node.querySelector(".contact-email-text").textContent = contact.email;
      }

      if (contact.address) {
        node.querySelector(".contact-address-row").classList.remove("d-none");
        node.querySelector(".contact-address-text").textContent =
          contact.address;
      }

      if (contact.group) {
        var groupBadge = node.querySelector(".contact-group-badge");
        groupBadge.textContent = contact.group;
        groupBadge.classList.remove("d-none");
      }

      // small star/heart badges overlapping the top/bottom-right corner of
      // the avatar, only shown when the contact is actually flagged that way
      if (contact.favorite)
        node.querySelector(".avatar-badge-favorite").classList.remove("d-none");
      if (contact.emergency)
        node
          .querySelector(".avatar-badge-emergency")
          .classList.remove("d-none");

      // quick-action links in the footer — tel:/mailto: hand off straight to
      // the phone/mail app instead of doing anything inside the page. the
      // email one only appears at all if the contact actually has an email
      var callLink = node.querySelector(".quick-call");
      callLink.href = "tel:" + contact.phone;

      if (contact.email) {
        var emailLink = node.querySelector(".quick-email");
        emailLink.href = "mailto:" + contact.email;
        emailLink.classList.remove("d-none");
      }

      // favorite/emergency buttons toggle the flag directly on the card
      // (no need to open the edit modal just to star a contact) and swap
      // between the outline and solid icon so the active state is obvious
      var favoriteBtn = node.querySelector(".favorite-btn");
      var emergencyBtn = node.querySelector(".emergency-btn");
      // assign the btn to what it does functionally
      setToggleState(favoriteBtn, contact.favorite);
      setToggleState(emergencyBtn, contact.emergency);
      favoriteBtn.addEventListener("click", () =>
        toggleFlag(contact.id, "favorite"),
      );
      emergencyBtn.addEventListener("click", () =>
        toggleFlag(contact.id, "emergency"),
      );

      node
        .querySelector(".edit-btn")
        .addEventListener("click", () => openEdit(contact.id));
      node
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteContact(contact.id));

      row.appendChild(col);
    });

    contactsList.appendChild(row);
  }

  // shared by both the favorite and emergency buttons: toggles the "active"
  // class (drives the colored background with CSS) and swaps the icon between
  // its outline (fa-regular) and filled (fa-solid) version so an active
  // toggle reads as visibly "on" rather than just a color change
  function setToggleState(btn, isActive) {
    var icon = btn.querySelector("i");
    btn.classList.toggle("active", isActive);
    icon.classList.remove("fa-regular", "fa-solid");
    icon.classList.add(isActive ? "fa-solid" : "fa-regular");
  }

  // flips a favorite/emergency flag on one contact (found by id) and
  // re-renders everything so the card badge, sidebar list, and stat counts
  // all update together
  function toggleFlag(id, flagName) {
    var contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    contact[flagName] = !contact[flagName];
    saveContacts();
    renderAll();
  }
  function renderSidebar() {
    renderMiniList(
      favoritesList,
      favoritesEmpty,
      contacts.filter((c) => c.favorite),
    );
    renderMiniList(
      emergencyList,
      emergencyEmpty,
      contacts.filter((c) => c.emergency),
    );
  }
  // renders a small list of contacts in the sidebar, or shows the "no contacts" message if the list is empty. the same contact can appear in both lists if it's flagged as both favorite and emergency.
  function renderMiniList(container, emptyEl, list) {
    container.innerHTML = "";
    if (list.length === 0) {
      emptyEl.classList.remove("d-none");
      return;
    }
    emptyEl.classList.add("d-none");

    list.forEach((contact) => {
      var row = document.createElement("div");
      row.className = "sidebar-contact-row";
      // same initials + deterministic color helpers used on the main
      // contact cards, so a given contact looks the same in both places.
      // using escapeHtml() here because this row is built with innerHTML —
      // unlike the main cards (built with textContent with the template),
      // a contact name typed with characters like < or > could otherwise
      // break the markup or inject unintended HTML
      row.innerHTML = `
        <div class="sidebar-avatar-initials" style="background-color: ${getAvatarColor(contact.name)};">${escapeHtml(getInitials(contact.name))}</div>
        <div class="flex-grow-1 min-w-0">
          <p class="sidebar-contact-name">${escapeHtml(contact.name)}</p>
          <p class="sidebar-contact-phone">${escapeHtml(contact.phone)}</p>
        </div>
        <a href="tel:${escapeHtml(contact.phone)}" class="sidebar-call-btn" aria-label="Call ${escapeHtml(contact.name)}">
          <i class="fa-solid fa-phone"></i>
        </a>
      `;
      container.appendChild(row);
    });
  }
  // escapeHtml() is used to prevent XSS attacks by converting special characters in the contact name and phone number into their corresponding HTML entities. This ensures that any potentially malicious input is displayed as plain text rather than being executed as HTML or JavaScript.
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  //  Edit / Delete
  // opens the edit modal and updates the form with the contact's data when the edit button is clicked
  function openEdit(id) {
    var contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    editingId = id;
    populateForm(contact);
    modal.show();
  }

  // deletes a contact from the list and updates the UI
  function deleteContact(id) {
    if (!confirm("Delete this contact?")) return;
    contacts = contacts.filter((c) => c.id !== id);
    saveContacts();
    renderAll();
  }

  //  Search
  // filters the contacts list in real-time as the user types in the search input
  searchInput.addEventListener("input", () => {
    renderContactsList(searchInput.value.trim().toLowerCase());
  });

  //  Init
  // renders the entire app when the page loads, showing any saved contacts and updating the stats and sidebar lists if they exist
  renderAll();
})();
