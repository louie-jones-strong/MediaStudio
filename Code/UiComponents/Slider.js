class Slider
{
	constructor(parent, id, labelStr, min, max, value)
	{
		let holderDiv = createDiv();
		holderDiv.class('sliderHolder')
		holderDiv.parent(select(parent));

		let label = createDiv('<label for='+id+'>'+labelStr+':</label>');
		label.parent(holderDiv);

		let inputs = createDiv(
			'<input type="range" id='+id+'Slider min='+min+' max='+max+' value='+value+'></input>' +
			'<input class="SliderTextBox" type="number" id='+id+'TextBox min='+min+' max='+max+' value='+value+'></input>');
		inputs.parent(holderDiv);

		this.Slider = select('#'+id+'Slider');
		this.InputField = select('#'+id+'TextBox');

		this.Value = value;
		this.Min = min;
		this.Max = max;
	}

	Update()
	{
		let sliderValue = this.Slider.value();;
		let inputFieldValue = int(this.InputField.value());
		if (isNaN(inputFieldValue))
		{
			inputFieldValue = 0;
			if (inputFieldValue < this.Min ||
				inputFieldValue > this.Max)
				{
					inputFieldValue = this.Value
				}
		}

		if (this.Value != sliderValue)
		{
			this.SetValue(sliderValue);
		}
		else if (this.Value != inputFieldValue)
		{
			this.SetValue(inputFieldValue);
		}
	}

	SetValue(value)
	{
		this.Slider.elt.value = value;
		this.InputField.elt.value = value;
		this.Value = value;
	}
}