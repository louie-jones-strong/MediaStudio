class Selectable
{
	static CurrentFooterHtml = "";
	static Sliders = [];

	constructor()
	{
		this.Selected = false;
	}

	SetSelected(selected)
	{
		if (selected)
		{
			select(".SelectedTitle").html("<h2>"+this.Name+"</h2>")
			select(".SelectedOptions").html("");
			select("#footer").html("");
		}
		else
		{
			//clear SelectedOptions
			select(".SelectedTitle").html("");
			select(".SelectedOptions").html("");
			select("#footer").html("");
		}

		this.Selected = selected;
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
}