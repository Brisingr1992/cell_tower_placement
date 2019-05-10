UIManagement = {
    legendArbCenters: null,
    legendAlgCenters: null,
    legendCities: null,
    modeButton: null,
    algoTypeButton: null,
    selectedAlgoType:"kCenter",
    runAlgorithmButton: null,
    clearPageButton: null,
    cityMode: true,
    arbCenterMode: false,
    algCenterMode: false,
    showingAlert: false,
    modeButtonClassEnum: {city: "btn btn-light", arbCenter: "btn btn-success", algCenter: "btn btn-danger"},
    modeButtonText: {city: "City mode", arbCenter: "Arb.Center mode", algCenter: "Alg.Center mode"},
    algoTypeButtonClassEnum: {kCenter: "btn btn-primary", centerOfGravity: "btn btn-success", lloyd: "btn btn-info"},
    algoTypeButtonText: {kCenter: "K-Center", centerOfGravity: "Center Of Gravity", lloyd: "lloyd-kmeans"},

    getUIreferences: async function () {
        return new Promise((resolve, reject) => {
            UIManagement.legendArbCenters = $("#legendArbCenters")[0].firstChild;
            UIManagement.legendAlgCenters = $("#legendAlgCenters")[0].firstChild;
            UIManagement.legendCities = $("#legendCities")[0].firstChild;

            UIManagement.modeButton = $("#modeButton");
            // UIManagement.modeButton[0].onclick = UIManagement.modeManagementClick;

			UIManagement.algoTypeButton = $("#algoTypeButton");
			UIManagement.algoTypeButton[0].onclick = UIManagement.algoTypeManagementClick;

            UIManagement.runAlgorithmButton = $("#runAlgorithmButton");
            UIManagement.runAlgorithmButton[0].onclick = UIManagement.runAlgorithmOnClick;

            UIManagement.clearPageButton = $("#clearPageButton");
            UIManagement.clearPageButton[0].onclick = UIManagement.clearPageOnClick;

            resolve();
        })
    },

    modeManagementClick: () => {
        if(UIManagement.modeButton[0].className == UIManagement.modeButtonClassEnum.city){
            UIManagement.modeButton[0].className = UIManagement.modeButtonClassEnum.arbCenter;
            UIManagement.modeButton[0].textContent = UIManagement.modeButtonText.arbCenter;

            UIManagement.cityMode = !UIManagement.cityMode;
            UIManagement.arbCenterMode = !UIManagement.arbCenterMode;
        }else if(UIManagement.modeButton[0].className == UIManagement.modeButtonClassEnum.arbCenter){
            UIManagement.modeButton[0].className = UIManagement.modeButtonClassEnum.algCenter;
            UIManagement.modeButton[0].textContent = UIManagement.modeButtonText.algCenter;

            UIManagement.arbCenterMode = !UIManagement.arbCenterMode;
            UIManagement.algCenterMode = !UIManagement.algCenterMode;

        }else{
            UIManagement.modeButton[0].className = UIManagement.modeButtonClassEnum.city;
            UIManagement.modeButton[0].textContent = UIManagement.modeButtonText.city;

            UIManagement.algCenterMode = !UIManagement.algCenterMode;
            UIManagement.cityMode = !UIManagement.cityMode;
        }
    },

	algoTypeManagementClick: () => {
		if (UIManagement.algoTypeButton[0].className == UIManagement.algoTypeButtonClassEnum.kCenter) {
			UIManagement.algoTypeButton[0].className = UIManagement.algoTypeButtonClassEnum.centerOfGravity;
			UIManagement.algoTypeButton[0].textContent = UIManagement.algoTypeButtonText.centerOfGravity;
			UIManagement.selectedAlgoType = "centerOfGravity";
		} else if (UIManagement.algoTypeButton[0].className == UIManagement.algoTypeButtonClassEnum.centerOfGravity) {
			UIManagement.algoTypeButton[0].className = UIManagement.algoTypeButtonClassEnum.lloyd;
			UIManagement.algoTypeButton[0].textContent = UIManagement.algoTypeButtonText.lloyd;
			UIManagement.selectedAlgoType = "lloyd-kmeans";
		} else {
			UIManagement.algoTypeButton[0].className = UIManagement.algoTypeButtonClassEnum.kCenter;
			UIManagement.algoTypeButton[0].textContent = UIManagement.algoTypeButtonText.kCenter;
			UIManagement.selectedAlgoType = "kCenter";
		}
	},

    runAlgorithmOnClick: () =>{
        UIManagement.showingAlert = true;

        Swal.fire({
            title: 'Submit number of towers',
            input: 'number',
            inputPlaceholder: '1,2,3 ...',
            inputAttributes: {
                min: 1,
                step: 1
            },
            showCancelButton: true,
            confirmButtonText: 'Run algorithm',
          }).then((result) => {
            if (result.value) {
                ElementsManagement.centersNumber = result.value;

                switch (UIManagement.selectedAlgoType) {
					case "centerOfGravity":
						approxWithCenterOfGravityAlgorithm();
						break;
                    case 'lloyd-kmeans':
                        approxWithLloydAlgorithm();
                        break;
					default:
						approxWithoutRAlgorithm();

				}
            }
            UIManagement.showingAlert = false;
          })
    },

    clearPageOnClick: () => {
        UIManagement.showingAlert = true;

		ElementsManagement.clearAllElements();
		location.reload();
        /*Swal.fire({
            title: 'Clean sketch',
            text: "What elements clear?",
            input: 'select',
            inputOptions: {
            'ArbitraryCenters':'Arbitrary centers',
            'AlgorithmCenters':'Algorithm centers',
            'AllCenters':'All centers',
            'All':'All elements'
            },
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, go on!'
            }).then((result) => {
                let resValue = result.value; 
                if(resValue){
                    switch(resValue){
                        
                        case'ArbitraryCenters': ElementsManagement.clearArbitraryCenters();
                                                break;
                        case'AlgorithmCenters': ElementsManagement.clearAlgorithmCenters();
                                                break;
                        case'AllCenters':       ElementsManagement.clearAllCenters();
                                                break;
                        case'All':              ElementsManagement.clearAllElements();
                                                break;
                    }
                    Swal.fire(
                        'All done!',
                        'The sketch is now clean.',
                        'success').then( () => UIManagement.showingAlert = false)
                }else
                    UIManagement.showingAlert = false;
          })*/
    }
}
