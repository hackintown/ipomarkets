export interface CompanyData {
    _id: {
      $oid: string
    }
    companyId: string
    tableId: string
    companyName: string
    basicInfo: {
      description: string
      industry: string
      founded: string
      headquarters: string
      ceo: string
      employees: string
      website: string
    }
    logo: {
      url: string
      alt: string
    }
    images: Array<{
      url: string
      caption: string
    }>
    tables: Array<{
      title: string
      data: Array<{
        [key: string]: string
      }>
    }>
    links: Array<{
      title: string
      url: string
      type: string
    }>
    content: Array<{
      title: string
      body: string
      order: number
    }>
    reviews: Array<{
      title: string
      content: string
      rating: number
      author: string
      date: string
      type: string
      listItems: string[]
      tableData: Array<{
        [key: string]: string
      }>
    }>
    news: Array<{
      title: string
      url: string
      date: string
      time: string
      description: string
      content: string
      source: string
      order: number
    }>
    createdAt: string
    updatedAt: string
  }
  
  