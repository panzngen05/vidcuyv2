  // Pastikan jQuery sudah dimuat sebelum skrip ini
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
    integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer">
  </script>

  <script>
    // Fungsi dasar UI (Mobile Menu, Animasi Klik)
    function toggleMobileNavbar() {
      document.getElementById("mobile-menu").classList.toggle("active");
    }

    document.querySelectorAll('.button-click').forEach(function(button) {
      button.addEventListener('mousedown', function() { this.classList.add('animate-click'); });
      const removeAnimation = () => { setTimeout(() => button.classList.remove('animate-click'), 100); };
      button.addEventListener('mouseup', removeAnimation);
      button.addEventListener('mouseleave', () => { if (button.classList.contains('animate-click')) { button.classList.remove('animate-click'); } });
    });

    // Fungsi untuk memicu klik input file
    function handleClick() {
      if ($("#selectedFile").length > 0) {
           $("#selectedFile").click();
      }
    }

    // --- LOGIKA UNGGAH SEBENARNYA ---
    let target = document.documentElement;
    let body = document.body;
    let fileInput = document.getElementById("selectedFile"); // Dapatkan elemen input file

    // Pastikan fileInput ada sebelum menambahkan listener
    if (fileInput) {
        fileInput.onchange = function() {
            upload(); // Panggil fungsi upload saat file dipilih
        }
    }

    target.addEventListener('dragover', (e) => {
        if ($("#selectedFile").is(":visible") || $("#selectedFile").hasClass("clickListenerFile")) {
            e.preventDefault();
            body.classList.add('dragging');
        }
    });

    target.addEventListener('dragleave', () => {
        body.classList.remove('dragging');
    });

    target.addEventListener('drop', (e) => {
         if ($("#selectedFile").is(":visible") || $("#selectedFile").hasClass("clickListenerFile")) {
            e.preventDefault();
            body.classList.remove('dragging');
            if (fileInput) {
               fileInput.files = e.dataTransfer.files;
               upload(); // Panggil fungsi upload
            }
        }
    });

    window.addEventListener('paste', e => {
        if (fileInput && ($("#selectedFile").is(":visible") || $("#selectedFile").hasClass("clickListenerFile"))) {
            fileInput.files = e.clipboardData.files;
            upload(); // Panggil fungsi upload
        }
    });

    // Fungsi upload yang sebenarnya menggunakan AJAX
    function upload() {
        var fileInput = document.getElementById('selectedFile');
        var formElement = document.getElementById('form');

        if (fileInput && formElement && fileInput.files.length > 0) {
            var formData = new FormData(formElement);

            // Update UI untuk menunjukkan proses upload
            $(".headline").hide();
            $(".description").hide();
            $(".upload-button").css('visibility', 'hidden');
            $(".upload-status").show();
            $(".headline-uploading").text("Uploading...");
            $("#progressBar").css('width', '0%');
            $("#processing-percentage").text("0% Uploaded").show();

            $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.round((evt.loaded / evt.total) * 100);
                            $("#progressBar").css('width', percentComplete + '%');
                            $("#processing-percentage").html(`<span>${percentComplete}%</span> Uploaded`);

                            if (percentComplete === 100) {
                                $(".headline-uploading").text("Processing...");
                                $("#processing-percentage").html("Finalizing upload...");
                            }
                        }
                    }, false);
                    return xhr;
                },
                url: '/api/upload', // Pastikan URL ini benar
                type: 'POST',
                context: this,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result && result.id) {
                         window.location.href = "/v?id=" + result.id; // Redirect ke link video
                    } else {
                         console.error("Upload successful, but no video ID received.");
                         alert("Upload successful, but failed to get video link. Please try again.");
                         // Kembalikan UI ke state awal
                         $(".headline").show();
                         $(".description").show();
                         $(".upload-button").css('visibility', 'visible');
                         $(".upload-status").hide();
                         $("#form")[0].reset();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Upload error:", textStatus, errorThrown);
                    alert("Upload failed. Please try again.");
                    // Kembalikan UI ke state awal
                    $(".headline").show();
                    $(".description").show();
                    $(".upload-button").css('visibility', 'visible');
                    $(".upload-status").hide();
                    $("#form")[0].reset();
                }
            });
        } else {
             if (!fileInput || fileInput.files.length === 0) {
                 console.log("No file selected.");
             }
        }
    }
  </script>
