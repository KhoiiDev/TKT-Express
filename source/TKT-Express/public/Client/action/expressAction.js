var isSubmitting = false;

function calculateCost() {
    const senderProvince = parseInt($('#senderProvince').val());
    const receiverProvince = parseInt($('#receiverProvince').val());
    const itemCategory = parseInt($('#itemCategory').val());

    const cost = Math.abs(senderProvince - receiverProvince) * itemCategory;

    $('#cost').text(cost);

    return cost;
}
function validateFile(imageInput) {
    if (!imageInput[0].files[0]) {
        return true;
    } else {
        const fileExtension = imageInput[0].files[0].name.split('.').pop().toLowerCase();
        const fileTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!fileTypes.includes(fileExtension)) {
            return true;
        }
    }
    return false;
}

function validateForm() {
    const form = $("#express_form");
    const senderAddress = $('#senderAddress').val();
    const senderUserName = $('#senderUserName').val();
    const senderPhone = $('#senderPhone').val();
    const receiverAddress = $('#receiverAddress').val();
    const receiverUserName = $('#receiverUserName').val();
    const receiverPhone = $('#receiverPhone').val();
    const itemDetails = $('#itemDetails').val();
    const itemWeight = $('#itemWeight').val();
    const senderEmail = $('#senderEmail').val();
    const itemImageFile = $('#itemImage');

    const senderProvinceText = $('#senderProvince option:selected').text();
    const receiverProvinceText = $('#receiverProvince option:selected').text();
    const itemCategoryText = $('#itemCategory option:selected').text();

    let isValue = true;

    if (validateFile(itemImageFile) || senderEmail === '' || itemWeight === '' || itemDetails === '' || senderAddress === '' || senderUserName === '' || senderPhone === '' || receiverAddress === '' || receiverUserName === '' || receiverPhone === '') {
        isValue = false;
    }

    if (!isValue) {
        // Display modal with error message
        $('#modal_form').modal('show');
    } else {
        isSubmitting = true;
        const cost = calculateCost();

        // Tạo đối tượng FormData
        const formData = new FormData();
        // Thêm tệp tin vào biểu mẫu dữ liệu
        formData.append('itemImage', itemImageFile.prop('files')[0]);
        // Thêm các thuộc tính khác vào biểu mẫu dữ liệu
        formData.append('senderAddress', senderAddress);
        formData.append('senderUserName', senderUserName);
        formData.append('senderPhone', senderPhone);
        formData.append('receiverAddress', receiverAddress);
        formData.append('receiverUserName', receiverUserName);
        formData.append('receiverPhone', receiverPhone);
        formData.append('itemCategory', itemCategoryText);
        formData.append('cost', cost);
        formData.append('senderProvince', senderProvinceText);
        formData.append('receiverProvince', receiverProvinceText);
        formData.append('itemDetails', itemDetails);
        formData.append('itemWeight', itemWeight);
        formData.append('senderEmail', senderEmail);

        // AJAX method
        $.ajax({
            url: '/express/create',
            type: 'POST',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                form.off('submit'); // Xóa sự kiện submit trên form
                form[0].reset();

                window.location.href = response.redirectUrl;
            },
            error: function (err) {
                if (err.responseJSON.exists) {
                    notification.text("Đăng nhập thất bại");
                }
                form.off('submit');
                form[0].reset();
            },
            complete: function () {
                isSubmitting = false;
            }
        });
    }
}

$(document).ready(function () {
    $('#express_form').submit(function (e) {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }
        validateForm();
    });
    calculateCost();

    $('#senderProvince').change(function () {
        calculateCost();
    });
    $('#receiverProvince').change(function () {
        calculateCost();
    });
    $('#itemCategory').change(function () {
        calculateCost();
    });
});

