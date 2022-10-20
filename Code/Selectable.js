class Selectable
{
	static CurrentFooterHtml = "";
	static Sliders = [];
	static CurrentSelection = null;

	constructor()
	{
		this.Name = "Default Selectable";
	}

	IsSelected()
	{
		return this != Selectable.CurrentSelection
	}

	SetSelected(selected)
	{
		if (selected)
		{
			select(".SelectedTitle").html("<h2>"+this.Name+"</h2>")
			select(".SelectedOptions").html("");
			select("#footer").html("");
			Selectable.CurrentSelection = this;
		}
		else
		{
			if (Selectable.CurrentSelection == this)
			{
				//clear SelectedOptions
				select(".SelectedTitle").html("");
				select(".SelectedOptions").html("");
				select("#footer").html("");
				Selectable.CurrentSelection = null;
			}
		}
	}

	Draw()
	{
		Selectable.Sliders.forEach(item => {
			item.Update();
		});

		let footerHtml = this.GetFooterHtml();
		if (Selectable.CurrentFooterHtml != footerHtml)
		{
			select("#footer").html(footerHtml);
			Selectable.CurrentFooterHtml = footerHtml;
		}
	}

	GetFooterHtml()
	{
		let canvasPosX = Math.round(MousePosX);
		let canvasPosY = Math.round(MousePosY);
		let footerHtml = "<p>Cursor Position: "+canvasPosX+", "+canvasPosY+"</p>";

		return footerHtml;
	}

// option buttons
	AddDropDownOption(options, selectedIndex, onChange)
	{
		var self = this;

		let dropDown = createSelect();
		dropDown.option(options[selectedIndex]);
		for (const key in options)
		{
			dropDown.option(key);
		}
		dropDown.selected(options[selectedIndex]);
		dropDown.parent(select(".SelectedOptions"));
		dropDown.style("height: max-content;")


		dropDown.changed(function()
		{
			onChange();
		});

		return dropDown;
	}

	AddToolOption(name, icon, onSelect)
	{
		let button = this.AddButton(name, icon);

		var self = this;
		button.mouseClicked(function()
		{
			self.SelectOption(name);
			onSelect();
		});
	}

	SelectOption(name)
	{
		let items = selectAll(".optionsBarItem");
		for (let i = 0; i < items.length; i++)
		{
			//remove selected styling from all tools
			this.SetSelectedOptionSelected(items[i], false)
		}
		let item = select("#" + name + "optionsBarItem");
		this.SetSelectedOptionSelected(item, true)
	}

	SetSelectedOptionSelected(option, selected)
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

	SetOptionDisabled(option, disabled)
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

	AddButton(name, icon)
	{
		let button = createDiv("<img src='" + icon + "'></img>");
		button.class('optionsBarItem')
		button.id(name + "optionsBarItem")
		button.parent(select(".SelectedOptions"));

		return button;
	}

	AddValueSlider(id, label, min, max, value)
	{
		let slider = new Slider(".SelectedOptions", id, label, min, max, value);
		Selectable.Sliders.push(slider);
		return slider;
	}

	AddColourPicker(id, label, rgbHex="#ffffff", alphaValue=255)
	{
		let optionsHolder = select(".SelectedOptions")
		optionsHolder.html(
			`<div class="RGBAPicker">
			<h3 class="center">${label}</h3>
			<input class="colorPicker" id="${id}_color" type="color" value="${rgbHex}">
			<input class="alphaSlider" id="${id}_alpha" type="range" min="0" max="255" value="${alphaValue}"></input>
			</div>`, true)

		let colorPicker = new ColorPicker(null, id);
		return colorPicker;
	}
}