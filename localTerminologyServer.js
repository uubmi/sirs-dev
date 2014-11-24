//localTerminologyServer.js
//made to support our very small vocabulary

//Required:
//matches SNOMED-CT codes to EHR data variable names
function SNOMEDtoLocalVariableSIRS (snomedCode){
	var snomedLocalMap = { 
		"105723007":"temperature",
		"301113001":"heartRate",
		"301283003":"respiratoryRate",
		"373677008":"PaCO2",
		"365630000":"whiteBloodCellCount",
		"442113000":"bandNeutrophilCount"
	};
	return snomedLocalMap[snomedCode];
}
//required

//Required:
//matches SNOMED-CT codes to EHR data variable names
function SNOMEDtoLocalDisplayName (snomedCode){
	var snomedLocalMap = { 
		"105723007":"temperature",
		"301113001":"heart rate",
		"301283003":"respiratory rate",
		"373677008":"PaCO2",
		"365630000":"white blood cell count",
		"442113000":"bandNeutrophilCount"
	};
	return snomedLocalMap[snomedCode];
}
//required

//matches EHR data to SNOMED codes
function LocalVariabletoSNOMEDSIRS (localVariableName){
	return false;
}