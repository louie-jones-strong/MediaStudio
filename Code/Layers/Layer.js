class Layer
{
	constructor(layerId, layerName, pixelArray)
	{
		this.LayerId = layerId;
		this.LayerName = layerName;
		this.Show = true;

		if (pixelArray == null)
		{
			pixelArray = new Uint8ClampedArray(width * pixelDensity() * height * pixelDensity() * 4)
		}
		this.PixelArray = pixelArray;
	}

	DrawLayerIcon(html, selected)
	{
		html += `<div>
		<h3>${this.LayerName}</h3>
		<canvas id="${this.LayerId}Canvas" class="canvas" width="${width/10}" height="${height/10}"></canvas>

		</div>`;

		return html;
	}

	UpdateIcon()
	{
		let canvas = document.getElementById(`${this.LayerId}Canvas`);
		let ctx = canvas.getContext('2d');
		let canvasWidth = canvas.width;
		let canvasHeight = canvas.height;
	}

	DrawLayer()
	{

	}
}
