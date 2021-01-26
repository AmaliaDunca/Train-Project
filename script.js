//,
let mymap = L.map("mapid").setView([55.78786726960013, 12.521324157714842], 2);

let mapStyle = L.tileLayer(
  "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
);
mapStyle.addTo(mymap);

class Train {
  constructor() {
    this.menuIcon = document.querySelector("#menuIcon");
    this.slide = document.querySelector("#slide-in");
    this.taggleMenu();
    this.count = 0;
    this.c = 0;
    this.trainMovementTrainOne(false);
    this.trainMovementTrainTwo(false);
    this.TrainIconA = new L.Icon({
      iconUrl: "img/train.svg",
      iconSize: [27, 27],
      iconAnchor: [13, 27],
      popupAnchor: [1, -24]
    });
    this.TrainIconB = new L.Icon({
      iconUrl: "img/trainSecond.svg",
      iconSize: [27, 27],
      iconAnchor: [13, 27],
      popupAnchor: [1, -24]
    });
    this.markerA = L.marker([55.76136404907697, 12.522954940795898], {
      icon: this.TrainIconA
    })
      .addTo(mymap)
      .bindPopup("Train commuting on line Nærum")
      .openPopup();
    this.markerB = L.marker([55.81406311282012, 12.528115510940552], {
      icon: this.TrainIconB
    })
      .addTo(mymap)
      .bindPopup("Train commuting on line Nærum ")
      .openPopup();
    //all station icons
    this.stationIcon = new L.Icon({
      iconUrl: "img/trainStationFinal.svg",
      iconSize: [30, 30],
      iconAnchor: [13, 27],
      popupAnchor: [6, -24]
    });
    this.busIcon = new L.Icon({
      iconUrl: "img/bus-stop.svg",
      iconSize: [27, 27],
      iconAnchor: [13, 27],
      popupAnchor: [1, -24]
    });
    this.popupContent;
    //this.showDepartures();
    //menu
    this.btnDepartures = document.querySelector("#bntDepartures");
    this.input = document.querySelector("#station");
    this.heading = document.querySelector(".heading");
    this.img = document.querySelector(".imageContainer");
    this.table = document.querySelector(".departure");
    this.alldepartures = document.querySelector(".alldepartures");
    this.stations;
    this.coorsLayer;
    this.cls = ["st0", "st1", "st2", "st3", "st4", "st5", "st6", "st7", "st8"];
    //this.getDepartures();
    this.main();
    this.getDepartures("departures.json");
    this.dataDepartures;
    this.getMapJson("map.json");
    this.mainMapJson();
    this.dataMap;
    this.getGeojson();
    //hour
    this.d = new Date();
    this.h = this.d.getHours();
    this.m = this.d.getMinutes();
    this.currenthoure = `${this.h}.${this.m}`;
    this.notrainsleft = document.createElement("p");
    //Nerby
    this.btnNearby = document.querySelector("#nearby");
    this.nerbyMarkers();
    this.featureGroup;
    //routes
    this.routesBnt = document.querySelector(".routes");
    this.route1 = document.querySelector(".nae-jae");
    this.route2 = document.querySelector(".jae-nae");
    this.route();
    this.check = false;
    this.check2 = false;
    //clock icon
    this.clock = document.querySelector(".clock");
    //input
    this.inputMethod();
    //reauseble code
    this.zoomInAndMenu;
    this.switchCase;
  }
  inputMethod(i) {
    let that = this;
    fetch("map.json")
      .then(res => res.json())
      .then(json => {
        that.input.addEventListener("keyup", function(e) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
            json.features.forEach(e => {
              if (
                that.input.value.toLowerCase() ==
                e.properties.name.toLowerCase()
              ) {
                that.zoomInAndMenu(e);
                console.log("same");
                that.switchCase(e);
              }
            });
          }
        });
      });
  }
  route() {
    this.route1.addEventListener("click", () => {
      mymap.fitBounds(this.coorsLayer.getBounds(), {
        padding: [20, 20]
      });
      console.log("you clickked route nae-jae");
      if (this.check == false) {
        this.check = true;
        this.trainMovementTrainOne(true);
        this.route1.classList.add("btn-clicked");
      } else {
        this.route1.classList.remove("btn-clicked");
        this.check = false;
        this.trainMovementTrainOne(false);
      }
    });
    this.route2.addEventListener("click", () => {
      console.log("you clickked route jae- nae");
      if (this.check2 == false) {
        this.check2 = true;
        this.trainMovementTrainTwo(true);
        this.route2.classList.add("btn-clicked");
      } else {
        this.route2.classList.remove("btn-clicked");
        this.check2 = false;
        this.trainMovementTrainTwo(false);
      }
    });
  }
  nerbyMarkers() {
    let markers = [];
    let coordonatesNearby = [
      [55.77367652953477, 12.499094009399414],
      [55.78077254556532, 12.484245300292969],
      [55.78376503568999, 12.512054443359375],
      [55.794429945434764, 12.522010803222656],
      [55.7953467018268, 12.493257522583008],
      [55.800123135977486, 12.525186538696289],
      [55.81295388572365, 12.530508041381836]
    ];
    coordonatesNearby.forEach(coord => {
      let marker = L.marker(coord, {
        icon: this.busIcon
      });
      markers.push(marker);
    });
    this.btnNearby.addEventListener("click", () => {
      mymap.fitBounds(this.coorsLayer.getBounds(), {
        padding: [20, 20]
      });
      if (mymap.hasLayer(this.featureGroup)) {
        mymap.removeLayer(this.featureGroup);
      } else {
        this.featureGroup = L.featureGroup(markers).addTo(mymap);
        //featureGroup.addTo(mymap);
      }
    });
  }
  async getMapJson(url) {
    const response = await fetch(url);

    return response.json();
  }
  async getDepartures(url) {
    const response = await fetch(url);

    return response.json();
  }
  async main() {
    this.dataDepartures = await this.getDepartures("departures.json");
    console.log(this.dataDepartures);
  }
  async mainMapJson() {
    return (this.dataMap = await this.getMapJson("map.json"));

    console.log(this.dataMap);
  }

  async taggleMenu() {
    let data = await this.mainMapJson();
    console.log(data);
    this.menuIcon.addEventListener("click", () => {
      if (this.slide.classList.contains("in")) {
        console.log("has in class");
        this.slide.classList.remove("in");
        this.menuIcon.classList.remove("out");
        mymap.fitBounds(this.coorsLayer.getBounds(), {
          padding: [20, 20]
        });
      } else {
        this.menuIcon.classList.add("out");
        this.slide.classList.add("in");
      }
    });
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async trainOne() {
    this.count++;
    let cord = this.dataMap.features[9].geometry.coordinates[this.count];
    this.markerB.setLatLng([cord[1], cord[0]]);
    if (
      this.count == 29 ||
      this.count == 35 ||
      this.count == 46 ||
      this.count == 57 ||
      this.count == 94 ||
      this.count == 109
    ) {
      this.trainMovementTrainOne(false);
      await this.sleep(3400);
      this.trainMovementTrainOne(true);
    }
    if (this.count == 143) {
      clearInterval(this.myTime);
    }
  }
  trainMovementTrainOne(ride) {
    if (ride == true) {
      this.myTime = setInterval(() => {
        this.trainOne();
      }, 100);
    } else {
      clearInterval(this.myTime);
    }
  }
  async trainTwo() {
    this.c++;
    let cord = this.dataMap.features[8].geometry.coordinates[this.c];
    this.markerA.setLatLng([cord[1], cord[0]]);

    if (
      this.c == 1 ||
      this.c == 40 ||
      this.c == 54 ||
      this.c == 87 ||
      this.c == 106 ||
      this.c == 125 ||
      this.c == 137
    ) {
      this.trainMovementTrainTwo(false);
      await this.sleep(3400);
      this.trainMovementTrainTwo(true);
    }
    if (this.c == 162) {
      clearInterval(this.myTimeTwo);
    }
  }
  trainMovementTrainTwo(ride) {
    if (ride == true) {
      this.myTimeTwo = setInterval(() => {
        this.trainTwo();
      }, 100);
    } else {
      clearInterval(this.myTimeTwo);
    }
  }

  async getGeojson() {
    var that = this;
    fetch("map.json")
      .then(res => res.json())
      .then(json => {
        that.coorsLayer = L.geoJSON(json.features, {
          pointToLayer: function(feature, latlng) {
            return (that.stations = L.marker(latlng, {
              icon: that.stationIcon
            }));
          },
          onEachFeature: function(feature, layer) {
            switch (feature.properties.name) {
              case "Jægersborg":
                this.popupContent = "Jægersborg zone : 41";
                //that.img.classList.replace(...that.cls, 'st8');
                console.log();

                break;
              case "Nørgaardsvej":
                this.popupContent = "Nørgaardsvej zone : 41";

                break;
              case "Lyngby Lokal":
                this.popupContent = "Lyngby Lokal zone : 41";
                break;
              case "Fuglevad":
                this.popupContent = "Fuglevad zone : 51";

                //that.img.classList.add('st5');
                break;
              case "Brede":
                this.popupContent = "Brede zone : 51";
                break;
              case "Ørholm":
                this.popupContent = "Ørholm zone : 51";
                break;
              case "Ravnholm":
                this.popupContent = "Ravnholm zone : 51";
                break;
              case "Nærum Station":
                this.popupContent = "Nærum Station zone : 51";
                break;

              default:
                this.popupContent = "train station";
                that.img.classList.add("st0");
                break;
            }
            if (feature.geometry.type === "Point") {
              layer.bindPopup(this.popupContent);
              layer.on("mouseover", function(e) {
                this.openPopup();
              });
              layer.on("mouseout", function(e) {
                this.closePopup();
              });

              layer.on("click", function(e) {
                console.log(e);
                that.menuIcon.style.display = "block";
                if (
                  that.slide.classList == "in" &&
                  that.menuIcon.classList == "out"
                ) {
                  that.taggleMenu();

                  that.slide.classList.remove("in");
                  that.menuIcon.classList.remove("out");
                  mymap.fitBounds(that.coorsLayer.getBounds(), {
                    padding: [20, 20]
                  });
                } else {
                  that.slide.classList.add("in");
                  that.menuIcon.classList.add("out");
                  mymap.setView(e.latlng, 16);
                }
                let output = `<h2>Next train</h2> `;
                that.heading.innerHTML = "";
                that.switchCase(e.target.feature);
              });
            }
          }
        }).addTo(mymap);

        mymap.fitBounds(that.coorsLayer.getBounds(), {
          padding: [20, 20]
        });
      });
  }
  stationone(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${e}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  programfug(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${(e + 0.02).toFixed(2)}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  programbrede(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${(e + 0.04).toFixed(2)}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  programorholm(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${(e + 0.07).toFixed(2)}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  programravn(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${(e + 0.08).toFixed(2)}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  programnae(one) {
    this.btnDepartures.addEventListener("click", e => {
      this.alldepartures.classList.toggle("active");
      let outputAll = "<h2>All Trains</h2>";
      if (this.alldepartures.classList.contains("active")) {
        one.forEach(e => {
          outputAll += `<p>${(e + 0.1).toFixed(2)}</p>`;
        });
        this.alldepartures.innerHTML = outputAll;
      } else {
        this.alldepartures.innerHTML = "";
      }
    });
  }
  zoomInAndMenu(e) {
    this.menuIcon.style.display = "block";

    if (this.slide.classList == "in" && this.menuIcon.classList == "out") {
      this.taggleMenu();

      this.slide.classList.remove("in");
      this.menuIcon.classList.remove("out");
      mymap.fitBounds(this.coorsLayer.getBounds(), {
        padding: [20, 20]
      });
    } else {
      this.slide.classList.add("in");
      this.menuIcon.classList.add("out");
      mymap.setView(
        [e.geometry.coordinates[1], [e.geometry.coordinates[0]]],
        16
      );
    }
  }

  switchCase(e) {
    let output = `<h2>Next train</h2> `;

    //let outputAll = '<h2>All Trains</h2>';
    this.heading.innerHTML = "";
    switch (e.properties.name) {
      case "Jægersborg":
        this.img.classList.remove(...this.cls);
        this.input.placeholder = "Jægersborg";
        this.heading.innerHTML = "Jægersborg";
        this.img.classList.toggle("st8");
        let jae = this.dataDepartures.program[0].Jae.hour;
        this.stationone(jae);

        jae.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<h3>${e}</h3> `;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;

        console.log(output);
        break;
      case "Nørgaardsvej":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st7");
        this.input.placeholder = "Nørgaardsvej";
        this.heading.innerHTML = "Nørgaardsvej";
        let nor = this.dataDepartures.program[0].Nor.hour;
        this.stationone(nor);
        nor.forEach(e => {
          if (e > that.currenthoure && e - that.currenthoure < 1) {
            console.log(e - that.currenthoure);
            output += `<p>${e}0</p>`;
          } else {
            that.notrainsleft.innerHTML = `No trains at this hour: ${that.currenthoure}`;
            that.table.appendChild(that.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        console.log(this.currenthoure);

        break;
      case "Lyngby Lokal":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st6");
        this.input.placeholder = "Lyngby Lokal";
        this.heading.innerHTML = "Lyngby Lokal";
        let lyng = this.dataDepartures.program[0].Lyn.hour;
        this.stationone(lyng);
        lyng.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${e}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
      case "Fuglevad":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st5");
        this.input.placeholder = "Fuglevad";
        this.heading.innerHTML = "Fuglevad";
        let fug = this.dataDepartures.program[0].Lyn.hour;
        this.programfug(fug);
        fug.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${(e + 0.02).toFixed(2)}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
      case "Brede":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st4");
        let brede = this.dataDepartures.program[0].Lyn.hour;
        this.programbrede(brede);
        this.input.placeholder = "Brede";
        this.heading.innerHTML = "Brede";
        brede.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${(e + 0.04).toFixed(2)}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
      case "Ørholm":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st3");
        let orholm = this.dataDepartures.program[0].Lyn.hour;
        this.programorholm(orholm);

        this.input.placeholder = "Ørholm";
        this.heading.innerHTML = "Ørholm";
        orholm.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${(e + 0.07).toFixed(2)}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
      case "Ravnholm":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st2");
        this.input.placeholder = "Ravnholm";
        this.heading.innerHTML = "Ravnholm";
        let ravnholm = this.dataDepartures.program[0].Lyn.hour;
        this.programravn(ravnholm);
        ravnholm.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${(e + 0.08).toFixed(2)}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
      case "Nærum Station":
        this.img.classList.remove(...this.cls);
        this.img.classList.toggle("st1");
        this.input.placeholder = "Nærum Station";
        this.heading.innerHTML = "Nærum Station";
        let nae = this.dataDepartures.program[0].Lyn.hour;
        this.programnae(nae);
        nae.forEach(e => {
          if (e > this.currenthoure && e - this.currenthoure < 1) {
            output += `<p>${(e + 0.1).toFixed(2)}</p>`;
          } else {
            this.notrainsleft.innerHTML = `No trains at this hour: ${this.currenthoure}`;
            this.table.appendChild(this.notrainsleft);
          }
        });
        this.table.innerHTML = output;
        break;
    }
  }
}

let train = new Train();
