class TemplateManager
{
	constructor()
	{
		this.Template = null;
		this.Inputs = {};
	}

	LoadTemplate(data)
	{
		this.Template = data;

		if (this.Template.Inputs == null ||
			Object.keys(this.Template.Inputs).length == 0)
		{
			this.TrySetupLayers();
		}
		else
		{
			this.CollectInputs();
		}
	}

	TrySaveOutputs()
	{
		if (this.Template == null ||
			this.Template.Outputs == null ||
			this.Template.Outputs.length == 0)
		{
			return false;
		}

		for (let i = 0; i < this.Template.Outputs.length; i++)
		{
			const output = this.Template.Outputs[i];
			Resize(output.Width, output.Height)
			saveCanvas(output.OutputName, output.OutputFileType);

		}
		return true;
	}

	CollectInputs()
	{
		let popup = OpenPopup(`<h2 class="center">${this.Template.Name}</h2>
								<p class="center">${this.Template.Description}</p> <br>`);




		for (const key in this.Template.Inputs)
		{
			this.Inputs[key] = null;
			let input = this.Template.Inputs[key]
			popup.html(`<label for="input_${key}">${input.Description}:</label>`, true);

			if (input.Type == "image")
			{
				let imageInput = createFileInput(file => {
					console.log("handle input file:", file);
					if (file.type === 'image')
					{
						console.log("Load image");
						loadImage(
							file.data,
							img => {
								this.Inputs[key] = img;
							},
							() => print('Image Failed to Load: '+ file),
						);
					}
				});
				imageInput.parent(popup);
				imageInput.id(`input_${key}`);
				imageInput.elt.accept = `${input.Type}/*`
			}
			else
			{
				popup.html(`<input type="${input.Type}" id="input_${key}">`, true);
			}
		}

		popup.html(`<div class="popupButtonGroup">
						<button onclick="ClosePopup()">Cancel</button>
						<button onclick="SubmitInputs()">Submit</button>
					</div>`, true);
	}

	SubmitInputs()
	{

		for (const key in this.Template.Inputs)
		{
			let inputData = this.Template.Inputs[key];
			let input = select(`#input_${key}`)

			if (inputData.Type == "image")
			{

			}
			else
			{
				this.Inputs[key] = input.value
			}
		}

		this.TrySetupLayers();
		ClosePopup();
	}

	TrySetupLayers()
	{
		console.log(this.Inputs);
		for (const key in this.Inputs)
		{
			if (this.Inputs[key] == null)
			{
				return;
			}
		}

		Layers.ClearLayers();

		for (const key in this.Template.Layers)
		{
			const layerData = this.Template.Layers[key];

			let img = null;
			if (layerData.Image != null)
			{
				img = this.Inputs[layerData.Image]
			}

			let resizePivotX = 0
			if (layerData.ResizePivotX != null)
			{
				resizePivotX = layerData.ResizePivotX;
			}
			let resizePivotY = 0
			if (layerData.ResizePivotY != null)
			{
				resizePivotY = layerData.ResizePivotY;
			}

			let layer = new Layer(Layers.Layers.length, key, img, resizePivotX=0, resizePivotY=0);
			Layers.AddLayer(layer);

			for (let i = 0; i < layerData.Effects.length; i++)
			{
				const effectData = layerData.Effects[i];
				layer.AddEffect(effectData.Type)
			}

			layer.Alpha = layerData.Alpha
		}
	}
}


function SubmitInputs()
{
	Template.SubmitInputs()
}