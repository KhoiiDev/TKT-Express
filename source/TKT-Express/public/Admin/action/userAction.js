var isSubmitting = false;

// new data
function AddNew() {

    const form = $("#modalFormAdd");
    form[0].reset();
    const username = $("#username");
    const password = $("#password");
    const CfPassword = $("#CfPassword");
    const role = $("#role");

    const imageInput = $("#imageInput");

    const errorName = $("#errorName");
    const errorPass = $("#errorPass");
    const errorCfpass = $("#errorCfpass");
    const errorRole = $("#errorRole");
    const errorImage = $("#errorImage");

    const imagePreview = $("#imagePreview");
    // cờ kiểm tra nhấn submit
    ShowImage(imageInput, imagePreview)


    form.submit(async function (event) {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }

        try {
            if (validateText(username, password, CfPassword, role, errorName, errorPass, errorCfpass ,errorRole) && validateFile(imageInput, errorImage)) {

                $('#growingLoadingID').css('display', 'block');
                isSubmitting = true;
                $('#modalSpinner').modal("show");
                const formData = new FormData(form[0]);

                $.ajax({
                    url: '/admin/user/create',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.reaction) {
                            flashMessage('Success', 'Thêm mới user thành công');
                            form.off('submit'); // Xóa sự kiện submit trên form
                            form[0].reset();
                            const data = response.data;
                            const rowHTML = addHtml(data);
                            $('#myTable tbody').prepend(rowHTML);
                            setSerial();
                        }
                        $('#modalAdd').modal('hide'); // Hide the modal form
                        $('#growingLoadingID').css('display', 'none');
                    },
                    error: function (err) {
                        if (err.responseJSON.exists) {
                            errorName.text('Username đã tồn tại');
                        }
                        flashMessage('Danger', 'Thêm user thất bại');
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
            flashMessage('Danger', 'Thêm user thất bại.');
        }
    });
}

///////////////////// delete data /////////////////////
function handleDelete(postData) {

    isSubmitting = true;

    $('#growingLoadingID').css('display', 'block');

    $.ajax({
        type: 'POST',
        url: '/admin/user/delete',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(postData)
    }).done(function (response) {
        if (response.reaction) {
            $(`#trow_${postData.id}`).hide();
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

    console.log(initialID);

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
///////////////////// edit data /////////////////////
function editData(initialName, initialRole, initialImage, initialID) {

    const form = $("#modalFormEdit");
    form[0].reset();
    const showUsername = $("#showUsername");
    const role = $("#role");
    const imageEditInput = $("#imageEditInput");

    const errorRole = $("#errorRole");

    const imagePreviewEdit = $("#imagePreviewEdit");
    // cờ kiểm tra nhấn submit

    showUsername.text(initialName);

    imagePreviewEdit.attr('src', initialImage);
    imagePreviewEdit.css('display', 'block');

    ShowImage(imageEditInput, imagePreviewEdit);



    form.submit(async function (event) {
        event.preventDefault();

        const newRoe = role.val();
        const newImage = imageEditInput.val();

        const hasChanged = newRoe !== initialRole || newImage !== '';

        if (hasChanged) {
            if (isSubmitting) {
                return;
            }
            let isValid = true;
            if (newRoe === '') {
                errorRole.text('Vui lòng nhập chính xác role');
                isValid = false;
            }
            else {
                errorRole.text('');
            }
            if (isValid) {
                $('#growingLoadingID').css('display', 'block');
                isSubmitting = true;
                $('#modalSpinner').modal("show");
                const formData = new FormData(form[0]);

                formData.append('filedName', initialImage);
                formData.append('id', initialID);

                $.ajax({
                    url: '/admin/user/update',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.reaction) {
                            flashMessage('Success', 'Cập nhật nhân viên thành công');
                            form.off('submit');
                            form[0].reset();
                            const data = response.data;
                            const rowHTML = addHtml(data);
                            $(`#trow_${initialID}`).replaceWith(rowHTML);
                            setSerial();
                        }
                        $('#modalEdit').modal('hide');
                        $('#growingLoadingID').css('display', 'none');
                    },
                    error: function (err) {
                        if (err.responseJSON.exists) {
                            errorName.text('Biển số đã tồn tại');
                        }
                        flashMessage('Danger', 'Cập nhật nhân viên thất bại');
                        $('#growingLoadingID').css('display', 'none');
                        console.log(err);
                    },
                    complete: function () {
                        isSubmitting = false;
                        imagePreviewEdit.attr('src', ''); // Gán đường dẫn hình ảnh nhập vào phần tử img
                        imagePreviewEdit.css('display', 'none'); // Hiển thị phần tử img
                    }
                });
            }
        }
        else {
            flashMessage("Warning", "Chưa cập nhập nhân viên !");
            $('#modalEdit').modal('hide');

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

function validateText(username, password, CfPassword, role, errorName, errorPass, errorCfpass ,errorRole) {
    let isValid = true;

    if (username.val().trim() === '') {
        errorName.text('Vui lòng nhập chính xác username');
        isValid = false;
    }
    else {
        errorName.text('');
    }
    if (password.val().trim() === '' || password.val().trim().length < 6) {
        errorPass.text('Vui lòng nhập chính xác mật khẩu có ít nhất 6 kí tự và số');
        isValid = false;
    }
    else {
        errorPass.text('');
    }
    if (CfPassword.val().trim() === '' || password.val().trim() !== CfPassword.val().trim()) {
        errorCfpass.text('Vui lòng nhập chính xác mật khẩu');
        isValid = false;
    }
    else {
        errorCfpass.text('');
    }
    if (role.val().trim() === '') {
        errorRole.text('Vui lòng chọn chính xác quyền');
        isValid = false;
    }
    else {
        errorRole.text('');
    }
    return isValid;
}

function addHtml(data) {
    const rowHTML = `
    <tr id="trow_${data._id}">
        <td>{{@index}}</td>
        <td>
            <div class="overflow-hidden" style="max-width: 250px;">
                <strong>${data.username}</strong>
            </div>
        </td>
        <td>
            <img id="img_${data._id}" src="${data.profilePhoto}" alt="" height="50">
        </td>

        <td>
            ${data.role}
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
                            <h4>${data.username}</h4>
                            <img src="${data.profilePhoto}" alt="Picture" height="150"
                                class="pb-4">
                            <h6 class="text-primary">Role:</h6>
                            <p>${data.role}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-link edit-button" data-bs-target="#modalEdit"
                data-bs-toggle="modal"
                onclick="editData('${data.username}', '${data.role}', '${data.profilePhoto}' , '${data._id}')">
                <i class='bx bx-pencil' style='color:#FFCC33'></i>
            </button>
            <button type="button" class="btn btn-link" data-bs-toggle="modal"
                data-bs-target="#modalDelete"
                onclick="deleteData('${data.username}','${data._id}')">
                <i class='bx bx-trash-alt' style='color:#ff0000'></i>
            </button>
        </td>
    </tr>`;
    return rowHTML;
}