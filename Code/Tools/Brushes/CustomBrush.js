class CustomBrush extends Brush
{
	constructor(index, img, name="Custom Brush")
	{
		super();
		this.Name = name;
		this.Id = "_Custom_Brush_" + index;
		this.Icon = img;
		this.BrushImage = null;

		var self = this;
		loadImage(
			this.Icon,
			img => {
				self.BrushImage = createGraphics(img.width, img.height)
				self.BrushImage.image(img, 0, 0);
			},
			() => print('Image Failed to Load: '+ file),
		);

		this.TintedCache = {}
	}

	Point(x, y)
	{
		let size = Tool.StrokeWeight * 2

		x -= size / 2;
		y -= size / 2;


		let tintedBrush = this.GetTintedBrush();
		Layers.CurrentImg.image(tintedBrush, x, y, size, size)
	}

	Line(x1, y1, x2, y2)
	{
		let dist = createVector(x1, y1).dist(createVector(x2, y2));

		let step = createVector((x2 - x1) / dist, (y2 - y1) / dist)
		for (let i = 0; i < dist; i++)
		{
			this.Point(x1 + step.x * i, y1 + step.y * i)
		}
	}

	GetTintedBrush()
	{
		let hex = Helpers.GetColorHex(ColorP.SelectedColor, true)

		if (!(hex in this.TintedCache))
		{
			let tintLevels = ColorP.SelectedColor.levels;
			this.TintedCache[hex] = Helpers.Tint(this.BrushImage, tintLevels)
		}

		return this.TintedCache[hex]


	}
}