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

	CollectInputs()
	{
		let html = "";

		html += `<h2 class="center">${this.Template.Name}</h2>
				<p class="center">${this.Template.Description}</p> <br>`;

		for (const key in this.Template.Inputs)
		{
			let input = this.Template.Inputs[key]
			html += ` <label for="input_${key}">${input.Description}:</label>`

			if (input.Type == "image")
			{
				html += `<input type="file" accept="${input.Type}/*" id="input_${key}">`;
			}
			else
			{
				html += `<input type="${input.Type}" id="input_${key}">`;
			}
		}

		html += `
			<div class="popupButtonGroup">
				<button onclick="ClosePopup()">Cancel</button>
				<button onclick="SubmitInputs()">Submit</button>
			</div>`

		OpenPopup(html);
	}

	SubmitInputs()
	{

		for (const key in this.Template.Inputs)
		{
			let inputData = this.Template.Inputs[key];
			let input = select(`#input_${key}`)

			console.log("input", key, input);

			if (inputData.Type == "image")
			{
				this.Inputs[key] = null;

				let path = input.elt.files[0].Name
				loadImage(
					path,
					img => {
						Template.Input[key] = img;
						Template.TrySetupLayers();

					},
					() => console.log('Image Failed to Load: ', input),
					);
			}
			else
			{
				this.Inputs[key] = input.value
			}
		}

		this.TrySetupLayers();
		// ClosePopup();
	}

	TrySetupLayers()
	{
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


			let layer = new Layer(Layers.Layers.length, key, null);
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

function LoadInputImage(file)
{
	console.log("handle file:", file);
	if (file.type === 'image')
	{
		console.log("Load image");
		loadImage(
			file.data,
			img => {
			},
			() => print('Image Failed to Load: '+ file),
		);
	}
}