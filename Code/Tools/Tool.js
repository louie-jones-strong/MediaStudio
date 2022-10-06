class Tool
{
	static StrokeWeight = 2;
	static CurrentFooterHtml = "";

	constructor()
	{
		this.Name = "BaseTool";
		this.Id = "Base_Tool";
		this.Icon = "";
		this.ShowStrokeSettings = true;

		this.StrokeWeightSlider = null;
		this.Sliders = [];
		this.NormalizeAspectRatio = false;
	}

	SelectTool()
	{
		var toolHeader = createDiv("<h2>"+this.Name+"</h2>");
		toolHeader.class('ToolName');
		toolHeader.parent(select(".ToolTitle"));

		if (this.ShowStrokeSettings)
		{
			this.StrokeWeightSlider = this.AddToolValueSlider("StrokeWeight", "Stroke Weight", 1, 100, Tool.StrokeWeight);
		}
	}

	//when the tool is deselected update the pixels to just show the drawing and
	//hide any overlays. Also clear ToolOptions
	UnselectTool()
	{
		//clear ToolOptions
		select(".ToolTitle").html("");
		select(".ToolOptions").html("");
		this.StrokeWeightSlider = null;
	}

	Draw()
	{
		if (this.ShowStrokeSettings)
		{
			Tool.StrokeWeight = this.StrokeWeightSlider.Value;
			Layers.CurrentImg.strokeWeight(Tool.StrokeWeight);
		}

		this.Sliders.forEach(item => {
			item.Update();
		});


		var footerHtml = this.GetFooterHtml();

		if (Tool.CurrentFooterHtml != footerHtml)
		{
			select("#footer").html(footerHtml);
			Tool.CurrentFooterHtml = footerHtml;
		}
	}

	GetFooterHtml()
	{
		var canvasPosX = Math.round(mousePosX);
		var canvasPosY = Math.round(mousePosY);
		var footerHtml = "<p>Cursor Position: "+canvasPosX+", "+canvasPosY+"</p>";

		return footerHtml;
	}

	KeyTyped()
	{
	}

	KeyPressed()
	{
		if (keyCode === SHIFT)
		{
			this.NormalizeAspectRatio = true;
		}
	}

	KeyReleased()
	{
		if (keyCode === SHIFT)
		{
			this.NormalizeAspectRatio = false;
		}
	}


// option buttons

	AddToolOption(name, icon, onSelect)
	{
		var button = this.AddToolButton(name, icon);

		var self = this;
		button.mouseClicked(function()
		{
			self.SelectToolOption(name);
			onSelect();
		});
	}

	SelectToolOption(name)
	{
		var items = selectAll(".optionsBarItem");
		for (var i = 0; i < items.length; i++)
		{
			//remove selected styling from all tools
			this.SetToolOptionSelected(items[i], false)
		}
		var item = select("#" + name + "optionsBarItem");
		this.SetToolOptionSelected(item, true)
	}

	SetToolOptionSelected(option, selected)
	{
		if (selected)
		{
			option.elt.classList.add("selected");
		}
		else
		{
			option.elt.classList.remove("selected");
		}
	}

	SetToolOptionDisabled(option, disabled)
	{
		if (disabled)
		{
			option.elt.classList.add("disabled");
		}
		else
		{
			option.elt.classList.remove("disabled");
		}
	}

	AddToolButton(name, icon)
	{
		var button = createDiv("<img src='" + icon + "'></img>");
		button.class('optionsBarItem')
		button.id(name + "optionsBarItem")
		button.parent(select(".ToolOptions"));

		return button;
	}

	AddToolValueSlider(id, label, min, max, value)
	{
		var slider = new Slider(".ToolOptions", id, label, min, max, value);
		this.Sliders.push(slider);
		return slider;
	}
}