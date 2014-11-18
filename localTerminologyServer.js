//localTerminologyServer.js
//made to support our very small vocabulary
//matches EHR data to SNOMED codes

//Required:
//matches SNOMED-CT codes to EHR data variable names
function SNOMEDtoLocalVariableSIRS (snomedCode){
	var snomedLocalMap = { 
		"386725007":"temperature",
		"364075005":"heartRate",
		"86290005":"respiratoryRate",
		"373677008":"PaCO2",
		"365630000":"whiteBloodCellCount",
		"442113000":"bandNeutrophilCount"
	};
	return snomedLocalMap[snomedCode];
}
//required