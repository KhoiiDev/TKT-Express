var isSubmitting = false;

// new data
function AddNewBrands(element) {
    const form = $("#modalFormAdd");
    form[0].reset();

    const nameInput = $("#nameInput");
    const positionInput = $("#positionInput");
    const emailInput = $("#emailInput");
    const phoneInput = $("#phoneInput");
    const imageInput = $("#imageInput");
    // const workplace = $("#workplace");
    const workplace = $('#workplace');

    const errorName = $("#errorName");
    const errorEmail = $("#errorEmail");
    const errorPosition = $("#errorPosition");
    const errorPhone = $("#errorPhone");
    const errorImage = $("#errorImage");
    const errorWorkplace = $("#errorWorkplace");

    const imagePreview = $("#imagePreview");
    // cờ kiểm tra nhấn submit
    ShowImage(imageInput, imagePreview)

    form.submit(async function (event) {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }

        try {
            if (validateText(workplace, nameInput, positionInput, phoneInput, emailInput, errorName, errorPosition, errorPhone, errorEmail, errorWorkplace) && validateFile(imageInput, errorImage)) {

                $('#growingLoadingID').css('display', 'block');
                isSubmitting = true;
                $('#modalSpinner').modal("show");
                const formData = new FormData(form[0]);
                formData.set('workplace', $('#workplace option:selected').text());
                $.ajax({
                    url: '/admin/employee/create',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.reaction) {
                            flashMessage('Success', 'Thêm mới thương hiệu thành công');
                            form.off('submit'); // Xóa sự kiện submit trên form
                            form[0].reset();
                            const data = response.employee;
                            const rowHTML = addHtml(data);
                            $('#myTable tbody').prepend(rowHTML);
                            setSerial();
                        }
                        $('#modalAdd').modal('hide'); // Hide the modal form
                        $('#growingLoadingID').css('display', 'none');
                    },
                    error: function (err) {
                        if (err.responseJSON.exists) {
                            errorName.text('Nhân viên đã đã tồn tại');
                        }
                        flashMessage('Danger', 'Thêm thương hiệu thất bại');
                        $('#growingLoadingID').css('display', 'none');
                        console.log(err);
                    },
                    complete: function () {
                        isSubmitting = false;
                        imagePreview.attr('src', ''); // Gán đường dẫn hình ảnh nhập vào phần tử img
                        imagePreview.css('display', 'none'); // Hiển thị phần tử img
                    }
                });
            }
        }
        catch (error) {
            console.log(error.message)
            flashMessage('Danger', 'Thêm thương hiệu thất bại');
        }
    });
}

function handleDelete(postData) {

    isSubmitting = true;

    $('#growingLoadingID').css('display', 'block');

    $.ajax({
        type: 'POST',
        url: '/admin/employee/delete',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(postData)
    }).done(function (response) {
        if (response.reaction) {
            $(`#trow_${response.employee._id}`).hide();
            flashMessage('Success', 'Delete is successful');
        }
        $('#growingLoadingID').css('display', 'none');
    }).fail(function (err) {
        flashMessage('Danger', 'Delete is failed');
        $('#growingLoadingID').css('display', 'none');
    }).always(function () {
        isSubmitting = false;
        $('#modalDelete').modal('hide');
    })

}

function deleteData(initialName, initialID) {

    console.log(initialName);

    if (initialID !== '' && initialName !== '') {
        $('#modalDelete').modal('show');
        $("#NameDelete").text(initialName);
        if (!isSubmitting) {
            $('#confirm-delete').off('click').on('click', function () {
                handleDelete({ id: initialID });
            });
            $(document).off('keydown').on('keydown', function (e) {
                if (e.which === 13 && $('#modalDelete').is(':visible')) {
                    handleDelete({ id: initialID });
                }
            });
        }
    }
}
function editData(initialWorkplace, initialName, initialPosition, initialPhone, initialImage, initialEmail, initialID) {

    const form = $("#modalFormAdd");
    form[0].reset();

    const nameInput = $("#nameInput");
    const positionInput = $("#positionInput");
    const phoneInput = $("#phoneInput");
    const imageInput = $("#imageInput");
    const emailInput = $("#emailInput");
    const workplace = $('#workplace');

    const errorName = $("#errorName");
    const errorPosition = $("#errorPosition");
    const errorPhone = $("#errorPhone");
    const errorEmail = $("#errorEmail");
    const errorWorkplace = $("#errorWorkplace");

    const imagePreview = $("#imagePreview");

    nameInput.val(initialName);
    positionInput.val(initialPosition);
    phoneInput.val(initialPhone);
    emailInput.val(initialEmail);
    workplace.val(initialWorkplace);

    imagePreview.attr('src', initialImage);
    imagePreview.css('display', 'block');


    ShowImage(imageInput, imagePreview)

    form.submit(async function (event) {
        event.preventDefault();


        const newName = nameInput.val();
        const newPosition = positionInput.val();
        const newPhone = phoneInput.val();
        const newImage = imageInput.val();
        const newEmail = emailInput.val();
        const newWorkplace = workplace.val();

        const hasChanged = newWorkplace !== initialWorkplace || newEmail !== initialEmail || newName !== initialName || newPosition !== initialPosition || newPhone !== initialPhone || newImage !== '';

        if (hasChanged) {
            if (isSubmitting) {
                return;
            }
            if (validateText(workplace, nameInput, positionInput, phoneInput, emailInput, errorName, errorPosition, errorPhone, errorEmail, errorWorkplace)) {
                $('#growingLoadingID').css('display', 'block');
                isSubmitting = true;
                $('#modalSpinner').modal("show");
                const formData = new FormData(form[0]);
                formData.append('filedName', initialImage);
                formData.append('id', initialID);
                formData.set('workplace', $('#workplace option:selected').text());

                $.ajax({
                    url: '/admin/employee/update',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.reaction) {
                            flashMessage('Success', 'Cập nhật nhân viên thành công');
                            form.off('submit');
                            const data = response.employee;
                            const rowHTML = addHtml(data);
                            $(`#trow_${initialID}`).replaceWith(rowHTML);
                            setSerial();
                        }
                        $('#modalAdd').modal('hide');
                        $('#growingLoadingID').css('display', 'none');
                    },
                    error: function (err) {
                        if (err.responseJSON.exists) {
                            errorName.text('Nhân viên đã đã tồn tại');
                        }
                        flashMessage('Danger', 'Cập nhật nhân viên thất bại');
                        $('#growingLoadingID').css('display', 'none');
                        console.log(err);
                    },
                    complete: function () {
                        isSubmitting = false;
                        imagePreview.attr('src', ''); // Gán đường dẫn hình ảnh nhập vào phần tử img
                        imagePreview.css('display', 'none'); // Hiển thị phần tử img
                    }
                });
            }
        }
        else {
            flashMessage("Warning", "Chưa cập nhập nhân viên !");
            $('#modalAdd').modal('hide');

        }
    });

}

function ShowImage(uploadInput, previewImage) {
    // Bắt sự kiện khi người dùng chọn tập tin từ máy tính của họ
    uploadInput.on('change', function () {
        const file = this.files[0]; // Lấy tập tin đầu tiên trong danh sách đã chọn
        const reader = new FileReader(); // Tạo đối tượng FileReader để đọc tệp

        // Bắt sự kiện khi tệp được đọc thành công
        reader.addEventListener('load', function () {
            previewImage.attr('src', reader.result); // Gán đường dẫn của ảnh được đọc vào phần tử img
            previewImage.css('display', 'block'); // Hiển thị phần tử img
        });

        // Đọc tệp dưới dạng URL dữ liệu
        reader.readAsDataURL(file);
    });
}

function validateFile(imageInput, errorImage) {
    if (!imageInput[0].files[0]) {
        errorImage.text('Vui lòng chọn hình ảnh hoặc nhập URL');
        return false;
    } else {
        const fileExtension = imageInput[0].files[0].name.split('.').pop().toLowerCase();
        const fileTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!fileTypes.includes(fileExtension)) {
            errorImage.text('Vui lòng tải lên tệp hình ảnh hợp lệ (JPG, JPEG, PNG, GIF)');
            return false;
        } else {
            errorImage.text('');
        }
    }
    return true;
}

function validateText(workplace, nameInput, positionInput, phoneInput, emailInput, errorName, errorPosition, errorPhone, errorEmail, errorWorkplace) {
    let isValid = true;

    if (nameInput.val().trim() === '') {
        errorName.text('Vui lòng nhập chính xác tên nhân viên');
        isValid = false;
    }
    else {
        errorName.text('');
    }
    if (workplace.val().trim() === '') {
        errorWorkplace.text('Vui lòng chọn chính xác nơi làm việc của nhân viên');
        isValid = false;
    }
    else {
        errorWorkplace.text('');
    }
    if (emailInput.val().trim() === '') {
        errorEmail.text('Vui lòng nhập chính xác tên nhân viên');
        isValid = false;
    }
    else {
        errorEmail.text('');
    }
    if (positionInput.val().trim() === '') {
        errorPosition.text('Vui lòng nhập chính xác chức vụ nhân viên');
        isValid = false;
    }
    else {
        errorPosition.text('');
    }
    const phone = phoneInput.val().trim();
    if (phoneInput.val().trim() === '' || !/^0[0-9]+$/.test(phone)) {
        errorPhone.text('Vui lòng nhập chính xác số điện thoại nhân viên');
        isValid = false;
    }
    else {
        errorPhone.text('');
    }

    return isValid;
}

function addHtml(data) {
    const d = JSON.stringify(data);
    const rowHTML = `
    <tr id="trow_${data._id}">
        <td>{{@index}}</td>
        <td>
            <div class="overflow-hidden" style="max-width: 120px;">
                <strong>${data.name}</strong>
            </div>
        </td>
        <td>
            ${data.phoneNumber}
        </td>
        <td>
            ${data.email}
        </td>
        <td>
            <img id="img_${data._id}" src="/images/employee/${data.image}" alt="" height="50">
        </td>
        <td>
            <div class="overflow-hidden" style="max-width: 180px;">
                <p class="text-truncate">${data.workplace}</p>
            </div>
        </td>
        <td>
            <div class="overflow-hidden" style="max-width: 180px;">
                <p class="text-truncate">${data.position}</p>
            </div>
        </td>
        <td class="text-center">
            <button type="submit" class="btn btn-link" data-bs-toggle="modal"
                data-bs-target="#modalEdit_${data._id}">
                <i class='bx bxs-face-mask' style='color:#33CCFF'></i>
            </button>
            <div class="modal fade" id="modalEdit_${data._id}" tabindex="-1"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title" id="modalCenterTitle">DETAIL</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h4>${data.name}</h4>
                            <img src="/images/employee/${data.image}" alt="Picture"
                                height="150" class="pb-4">
                            <h6 class="text-primary">Position:</h6>
                            <p>${data.position}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-link edit-button" data-bs-target="#modalAdd"
                data-bs-toggle="modal"
                onclick="editData('${data.workplace}', '${data.name}', '${data.position}', '${data.phoneNumber}', '${data.image}', '${data.email}','${data._id}')">
                <i class='bx bx-pencil' style='color:#FFCC33'></i>
            </button>
            <button type="button" class="btn btn-link" data-bs-toggle="modal"
                data-bs-target="#modalDelete"
                onclick="deleteData('${data.name}', '${data._id}')">
                <i class='bx bx-trash-alt' style='color:#ff0000'></i>
            </button>
        </td>
    </tr>`;
    return rowHTML;
}