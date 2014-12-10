var ObservationFocus = function (code, codeSystem, codeSystemName, displayName) {
    this.code = code;
    this.codeSystem = codeSystem;
    this.codeSystemName = codeSystemName;
    this.displayName = displayName;
}

var ObservationValue = function (valueType, value) {
    this.valueType = valueType;
    this.value = value;
}

var ObservationEventTime = function (time) {
    this.observationEventTime = time;
}

var ObservationResult = function(code, codeSystem, codeSystemName, displayName, valueType, value, time) {
    this.observationFocus = new ObservationFocus(code, codeSystem, codeSystemName, displayName);
    this.observationValue = new ObservationValue(valueType,value);
    this.observationEventTime = new ObservationEventTime(time);
}

function copyObservationResult(parentCopy){	
	var code = parentCopy.observationFocus.code;
	var codeSystem = parentCopy.observationFocus.codeSystem;
	var codeSystemName = parentCopy.observationFocus.codeSystemName;
	var displayName = parentCopy.observationFocus.displayName;
	var valueType = parentCopy.observationValue.valueType;
	var value = parentCopy.observationValue.value;
	var observationEventTime = parentCopy.observationEventTime.observationEventTime;
	return new ObservationResult(
	code,
	codeSystem,
	codeSystemName,
	displayName,
	valueType,
	value,
	observationEventTime
	);
}