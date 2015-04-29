/**
 * format - is this grid of columns or rows?
 * itemsPerGroup - how many items should a group(row or column) contain
 */
Grid = function(id, format, itemsPerGroup) {
    this.BY_ROW = 1;
    this.BY_COLUMN = 2;
    this.currentFormat = format;
    this.itemsPerGroup = itemsPerGroup;
    this.id = id;
    return this;
};

Grid.prototype.render = function(list) {
    var gridItem, gridItemText, item, groupItem,
        groupItemChildrenCount = this.itemsPerGroup,
        itemContainer = document.getElementById(this.id);

    for (var i = 0; i < list.items.length; i++) {
        item = list.items[i];
        // TODO abstract it so different grid can be created
        gridItem = this.createVideoItem(item);

        if (groupItemChildrenCount >= this.itemsPerGroup) {
            if (groupItem != null) {
                itemContainer.appendChild(groupItem);
            }
            groupItem = document.createElement('div');
            groupItem.className = 'grid-group';
            groupItemChildrenCount = 1;
        } else {
            groupItemChildrenCount++;
        }
        gridItem.classList.add('group-item-' + groupItemChildrenCount);
        groupItem.appendChild(gridItem);
    }
};

Grid.prototype.createVideoItem = function(item)
{
    var i = document.createElement('div');
    i.style.backgroundImage = 'url(' + item.poster + ')';
    var title = '[' + item.year + ']' || '';
    title += (' ' + item.title || '');
    i.dataset.title = title;
    i.className = 'grid-item';
    i.dataset.id = item.id;
    i.tabIndex = -1;
    return i;
};

Grid.prototype.enterHandler = function(keyEvent) {
    if (keyEvent.srcElement.classList.contains('grid-item')
        && keyEvent.srcElement.dataset['id'] != undefined
    ) {
        var infoScene = Main.getScene(Main.SCENE_INFO_ID);
        infoScene.loadAndRenderInfo(keyEvent.srcElement.dataset['id']);
    }
};