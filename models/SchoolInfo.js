class SchoolInfo {
  constructor(name,subj) {
    this.schoolname = name
    this.subject = subj
  }

  toString() {
    return `SchoolInfo(${this.schooname},${this.subject})`
  }
}

module.exports = SchoolInfo
