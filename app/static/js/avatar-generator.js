//변수설정

var skins = [
    "FFFFFF",
    "D4B888",
    "E9FFFD",
    "fcee93",
    "02580D",
    "AA89BD",
    "FDDEDE",
    "F2E5A7",
    // "6C2FBB",
    // "7A2193",
    // "AA89BD",
    // "ED55BB",
    // "FF9F9F",
    // "F0C5D2",
    // "FDDEDE",
    // "122ED0",
    // "B0BDFD",
    // "D7E0F1",
    // "7483D2",
    // "38FEDB",
    // "127F2E",
    // "239454",
    // "51EF3A",
    // "928778",
    // "748393",
    // "40474F",
  ];
  var eyes = [
    "000000",
    "D4B888",
    "E9FFFD",
    "fcee93",
    "02580D",
    "AA89BD",
    "FDDEDE",
  ]; // 눈
  var pupils = [
    "ffffff",
    "D4B888",
    "E9FFFD",
    "fcee93",
    "02580D",
    "AA89BD",
    "FDDEDE",
  ]; // 동공
  var accesories = [
    "none",
    "ribbon",
    "circular_sunglasses",
    "cheektouch",
    "mustache",
  ]; // 악세사리
  
  //디폴트값
  
  var current_skincolor = "ffffff";
  
  //문서
  
  $(document).ready(function () {
    $("body").delegate("#menu_list button", "click", function () {
      var idx = $(this).attr("id");
      var selected = $(this).html();
      $("#options_title").html("SELECT " + selected);
      $("#options_div").html("");
  
      var html = "";
  
      switch (idx) {
        case "skincolor":
          for (var i = 0; i < skins.length; i++) {
            skin = skins[i];
            html +=
              "<div class='skins' id='s_" +
              skin +
              "' style='background-color:#" +
              skin +
              ";'></div>";
          }
          break;
  
        case "left eye":
          for (i = 0; i < eyes.length; i++) {
            left_e = eyes[i];
            html +=
              "<div class='lefteyes' id='e_" +
              left_e +
              "' style='background-color:#" +
              left_e +
              ";'></div>";
          }
          break;
  
        case "left pupil":
          for (i = 0; i < pupils.length; i++) {
            left_p = pupils[i];
            html +=
              "<div class='leftpupils' id='e_" +
              left_p +
              "' style='background-color:#" +
              left_p +
              ";'></div>";
          }
          break;
  
        case "right eye":
          for (i = 0; i < eyes.length; i++) {
            right_e = eyes[i];
            html +=
              "<div class='righteyes' id='e_" +
              right_e +
              "' style='background-color:#" +
              right_e +
              ";background-position:" +
              i * -40 +
              "px-400px;'></div>";
          }
          break;
  
        case "right pupil":
          for (i = 0; i < pupils.length; i++) {
            right_p = pupils[i];
            html +=
              "<div class='rightpupils' id='e_" +
              right_p +
              "' style='background-color:#" +
              right_p +
              ";'></div>";
          }
          break;
  
        case "accesories":
          for (var i = 0; i < accesories.length; i++) {
            accesory = accesories[i];
            html +=
              "<div class='accesories' id='a_" +
              accesory +
              "' style='background-color:#ffffff;background-position:" +
              i * -53 +
              "px -369px;'></div>";
          }
          break;
      }
  
      $("#options_div").html(html);
      $("#menu_lines").click();
    });
  
    $("body").delegate("#random", "click", function () {
      random();
    });
  
    $("body").delegate("#menu_lines", "click", function () {
      menu_class = $("#menu").attr("class");
      if (menu_class === "") {
        $("#menu").addClass("active");
        $("#menu").css({
          border: "0px",
        });
        $("#menu")
          .stop()
          .animate(
            {
              width: "360px",
            },
            {
              duration: 300,
              complete: function () {
                $(this).stop().animate(
                  {
                    height: "460px",
                  },
                  {
                    duration: 300,
                  }
                );
              },
            }
          );
      } else {
        $("#menu").removeClass("active");
        $("#menu").css({
          "border-right": "1px solid #707070",
        });
        $("#menu")
          .stop()
          .animate(
            {
              height: "99px",
            },
            {
              duration: 300,
              complete: function () {
                $(this).stop().animate(
                  {
                    width: "60px",
                  },
                  {
                    duration: 300,
                  }
                );
              },
            }
          );
      }
    });
    $("body").delegate(".skins", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      current_skincolor = id;
      $("#skin #phantom_skincolor").attr("fill", "#" + id);
    });
  
    $("body").delegate(".lefteyes", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      $("#eyes #left_eye").attr("fill", "#" + id);
    });
  
    $("body").delegate(".leftpupils", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      $("#eyes #left_pupil").attr("fill", "#" + id);
    });
  
    $("body").delegate(".righteyes", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      $("#eyes #right_eye").attr("fill", "#" + id);
    });
  
    $("body").delegate(".rightpupils", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      $("#eyes g").hide();
      $("#eyes #right_pupil").attr("fill", "#" + id);
    });
  
    $("body").delegate(".accesories", "click", function () {
      var id = $(this).attr("id");
      id = id.substr(2);
      $("#accesories g").hide();
      $("#accesories .accesory").hide();
      $("#accesories #a_" + id).show();
    });
  });
  
  //랜덤함수
  
  function random() {
    var rand_skins = skins[Math.floor(Math.random() * skins.length)];
    var rand_lefteye = eyes[Math.floor(Math.random() * eyes.length)];
    var rand_leftpupil = pupils[Math.floor(Math.random() * pupils.length)];
    var rand_righteye = eyes[Math.floor(Math.random() * eyes.length)];
    var rand_rightpupil = pupils[Math.floor(Math.random() * pupils.length)];
    var rand_accesories =
      accesories[Math.floor(Math.random() * accesories.length)];
  
    current_skincolor = rand_skins;
    current_lefteyecolor = rand_lefteye;
    current_righteyecolor = rand_righteye;
    current_leftpupilcolor = rand_leftpupil;
    current_rightpupilcolor = rand_rightpupil;
  
    $("#skin #phantom_skincolor").attr("fill", "#" + rand_skins);
    $("#eyes #left_eye").attr("fill", "#" + rand_lefteye);
    $("#eyes #right_eye").attr("fill", "#" + rand_righteye);
    $("#eyes #left_pupil").attr("fill", "#" + rand_leftpupil);
    $("#eyes #right_pupil").attr("fill", "#" + rand_rightpupil);
  
    $("#accesories g").hide();
    $("#accesories .accesory").hide();
    $("#accesories #a_" + rand_accesories).show();
  }
  
  const svgElement = document.querySelector("#avatar_all svg");
  const img = document.querySelector("#svg_img");
  const canvas = document.querySelector("#svg_canvas");
  
  $("#upload_phantom").click(function () {
    alert("캐릭터가 저장되었습니다.");
    function svgToCanvas() {
      var xml = new XMLSerializer().serializeToString(svgElement);
  
      var svg64 = btoa(unescape(encodeURIComponent(xml)));
      var b64Start = "data:image/svg+xml;base64,";
      var image64 = b64Start + svg64;
      img.src = image64;
  
      console.log(image64);
  
      img.onload = function () {
        let context = canvas.getContext("2d");
        context.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          img.width,
          img.height
        );
        console.log(img.width, img.height);
        console.log(canvas.width, canvas.height);
        console.log(context.width, context.height);
      };
    }
  
    function uploadPhantom() {
      let userLabel = document.querySelector("#register_id");
      let user = userLabel.innerText;
      const phantomBase64 = canvas.toDataURL("image/png", "image/octet-stream");
      var phantomData = phantomBase64.split(",")[1];
  
      const phantomFile = new Blob([phantomData], { type: "image/png" });
      const phantomFileName = user + ".png";
      var formData = new FormData();
      formData.append("file", phantomFile, phantomFileName);
  
      $.ajax({
        type: "POST",
        url: "/uploadPhantom",
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          alert("사진이 저장되었습니다.");
        },
      });
    }
    svgToCanvas();
    uploadPhantom();
  });
  
  //다운로드
  
  // $("#download").click(function () {
  //   function download(
  //     filename, // string
  //     blob // Blob
  //   ) {
  //     if (window.navigator.msSaveOrOpenBlob) {
  //       window.navigator.msSaveBlob(blob, filename);
  //     } else {
  //       const elem = window.document.createElement("a");
  //       elem.href = window.URL.createObjectURL(blob);
  //       elem.download = filename;
  //       document.body.appendChild(elem);
  //       elem.click();
  //       document.body.removeChild(elem);
  //     }
  //   }
  
  //   var svg = document.querySelector("#avatar_all svg");
  //   var data = new XMLSerializer().serializeToString(svg);
  
  //   var canvas = document.createElement("canvas");
  
  //   let userLabel = document.querySelector("#register_id");
  //   let user = userLabel.innerText;
  //   console.log(user);
  
  //   // Phantom download
  //   canvg(canvas, data, {
  //     renderCallback: function () {
  //       canvas.toBlob(function (blob) {
  //         download(`${user}.png`, blob);
  //       });
  //     },
  //   });
  // });