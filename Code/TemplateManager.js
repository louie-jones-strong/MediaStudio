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

		this.CollectInputs();
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

			RenderImage();

			saveCanvas(output.OutputName, output.OutputFileType);

		}
		return true;
	}

	GetInput(key)
	{
		return this.Inputs[key]
	}

	CollectInputs()
	{
		let popup = OpenPopup(`<h2 class="center">${this.Template.Name}</h2>
								<p class="center">${this.Template.Description}</p> <br>`);



		// setup loading assets that are marked as user inputs
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


		// load assets that don't need user input
		for (const key in this.Template.Layers)
		{
			const layerData = this.Template.Layers[key];

			if (layerData.Image != null &&
				!(layerData.Image in this.Inputs))
			{
				loadImage(
					layerData.Image,
					img => {
						this.Inputs[layerData.Image] = img;
					},
					() => print('Image Failed to Load: '+ file),
				);
			}
		}
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
				this.Inputs[key] = input.value()
			}
		}

		for (const key in this.Inputs)
		{
			if (this.Inputs[key] == null)
			{
				return;
			}
		}
		ClosePopup();

		this.TrySetupLayers()
	}

	TrySetupLayers()
	{
		Resize(this.Template.StartingCanvasWidth, this.Template.StartingCanvasHeight)

		Layers.ClearLayers();

		if (this.Template.FastEffects != null)
			Layers.FastEffects = this.Template.FastEffects

		let layerKeys = Object.keys(this.Template.Layers);
		for (let k = layerKeys.length-1; k >= 0; k--)
		{
			const key = layerKeys[k]
			const layerData = this.Template.Layers[key];

			let img = null;
			if (layerData.Image != null)
				img = this.Inputs[layerData.Image]

			let resizePivotX = 0
			if (layerData.ResizePivotX != null)
				resizePivotX = layerData.ResizePivotX;

			let resizePivotY = 0
			if (layerData.ResizePivotY != null)
				resizePivotY = layerData.ResizePivotY;

			let resizeWidth = -1
			if (layerData.ResizeWidth != null)
				resizeWidth = layerData.ResizeWidth;

			let resizeHeight = -1
			if (layerData.ResizeHeight != null)
				resizeHeight = layerData.ResizeHeight;

			let layer = new Layer(Layers.Layers.length, key, img, resizePivotX, resizePivotY, resizeWidth, resizeHeight);
			Layers.AddLayer(layer);

			for (let i = 0; i < layerData.Effects.length; i++)
			{
				const effectData = layerData.Effects[i];
				layer.AddEffect(effectData.Type)
			}

			layer.Alpha = layerData.Alpha;

			if (layerData.Actions != null)
				Actions.DoActions(layerData.Actions);
		}
	}
}


function SubmitInputs()
{
	Template.SubmitInputs()
}