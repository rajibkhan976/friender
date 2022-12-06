class friendlist {
  constructor() {
    this.pagesize = '#page-size'
    this.friendlist = '.ag-center-cols-container'
    this.agroot = 'div.ag-root-wrapper.ag-ltr.ag-layout-normal'
    this.selectall = 'input#ag-4-input.ag-input-field-input.ag-checkbox-input'
    this.firstrow = 'div.ag-header-row.ag-header-row-column'
    this.filter = 'div.ag-filter > form.ag-filter-wrapper.ag-focus-managed '
    this.getaggrid = 'div.ag-body-viewport.ag-row-animation.ag-layout-normal'
    this.getnamecolumn = ' div[col-id=friendName]'
    this.getgendercolumn = ' div[col-id=friendGender]'
    this.statuscolumn = ' div[col-id=friendStatus]'
    this.getfilter1 = this.filter + 'div.ag-filter-body-wrapper.ag-simple-filter-body-wrapper > div[ref="eCondition1Body"]'
    this.getfilter2 = this.filter + 'div.ag-filter-body-wrapper.ag-simple-filter-body-wrapper > div[ref="eCondition2Body"]'
    this.getfilterofeachcolumn = ' div.ag-header-cell-comp-wrapper > div.ag-cell-label-container > span.ag-header-icon.ag-header-cell-menu-button'
  }

  getfriendlisttab() {
    cy.get('.nav-bar > ul > li:nth-child(4)').click()
    cy.contains('friend list').should('be.visible')
  }

  getpagesize() {
    cy.get(this.pagesize).select('30')
    cy.get(this.friendlist).log()
  }

  get_selectall() {
    cy.get(this.selectall).click()
  }
  get_pagination() {
    cy.get(this.getall).scrollTo(0, 500)
    cy.get(this.getall + '> div.ag-center-cols-clipper > div.ag-center-cols-viewport > div.ag-center-cols-container> div[row-id]').then((i) => {
      let a = [i]
      console.log(a);
      cy.log(i.length)
    })
  }

  get_friend() {
    cy.fixture("friendlistdata.json").then((data) => {
      values = data;
      cy.get(this.firstrow + this.getnamecolumn + this.getfilterofeachcolumn).click()
      cy.get(this.getfilter1).type(values.name1)
    })
  }

  get_anotherfriend() {
    cy.fixture("friendlist2data.json").then((data) => {
      let values = data;
      cy.wait(5000)
      cy.log(values.name2)
      cy.get(this.firstrow + this.getnamecolumn + this.getfilterofeachcolumn).click()
      cy.get(this.getfilter2).click().type(values.name2)
    })
  }

  get_orbutton() {
    cy.get(this.filter + '> div.ag-filter-body-wrapper.ag-simple-filter-body-wrapper > div.ag-filter-condition > div[ref=eJoinOperatorOr] > div.ag-wrapper.ag-input-wrapper.ag-radio-button-input-wrapper > input[type=radio]').click()
  }

  apply() {
    cy.get(this.filter + 'div.ag-filter-apply-panel > button[type=submit]').contains("Apply").click()
  }

  namecolumnsortwithdescending() {
    cy.get(this.agroot).agGridSortColumn("Name", "descending")
  }

  namecolumnsortwithascending() {
    cy.get(this.agroot).agGridSortColumn("Name", "ascending")
  }

  statuscolumnsortwithascending() {
    cy.get(this.agroot).agGridSortColumn("Status", "ascending")
  }

  statuscolumnsortwithdescending() {
    cy.get(this.agroot).agGridSortColumn("Status", "descending")
  }

  syncandaddeddateandtimecolumnsortwithdescending() {
    cy.get(this.agroot).agGridSortColumn("Sync & Added Date &  Time ", "descending")
  }

  totalreactioncolumnsortwithdescending() {
    cy.get(this.agroot).agGridSortColumn("Total Reaction", "descending")
  }

  totalreactioncolumnsortwithascending() {
    cy.get(this.agroot).agGridSortColumn("Total Reaction", "ascending")
  }

  messagecountcolumnsortwithascending() {
    cy.get(this.agroot).agGridSortColumn("Message Count", "ascending")
  }

  messagecountcolumnsortwithdescending() {
    cy.get(this.agroot).agGridSortColumn("Message Count", "descending")
  }

  totalcommentcolumnsortwithascending() {
    cy.get(this.agroot).agGridSortColumn("Total Comment", "ascending")
  }

  totalcommentcolumnsortwitdescending() {
    cy.get(this.agroot).agGridSortColumn("Total Comment", "descending")
  }

  filterwithmale() {
    cy.get("div.ag-root-wrapper.ag-ltr.ag-layout-normal").agGridColumnFilterTextMenu({
      searchCriteria: [{
        columnName: "Gender ",
        filterValue: "Male",
        operator: "Equals"
      }
      ],
      hasApplyButton: false
    })
  }

  filterwithfemale() {
    cy.get(this.getgendercolumn + this.getfilterofeachcolumn).click()
    cy.get(this.getfilter1).type("Female")
  }

  status_deactivate() {
    cy.get(this.statuscolumn + this.getfilterofeachcolumn).click()
    cy.get(this.getfilter1).type("Deactivate")
  }

  reset() {
    cy.get(this.statuscolumn + this.getfilterofeachcolumn).click()
    cy.get(this.filter + 'div.ag-filter-apply-panel > button[type=button]').click()
  }
}
module.exports = new friendlist();