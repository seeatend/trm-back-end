class Controller {
  constructor({model, methods}) {
    this.model = model
    Object.assign(this, methods)
  }

  create(body) {
    return this.model.create(
      body
    ).then(res => {
      res.wasNew = true
      return Promise.resolve(res)
    })
  }

  find(query) {
    return this.model.find(query)
  }

  findOne(query = {}) {
    if (Object.keys(query).length === 0) {
      throw new Error('Query is empty')
    }
    if (query.id) {
      return this.findById(query.id)
    }
    return this.model.findOne(
      query
    )
  }

  findById(id) {
    return this.model.findById(id)
  }

  updateById({id, data}) {
    return this.findById(
      id
    ).then(res => {
      return Object.assign(res, data).save()
    })
  }

  updateOrCreate({query = {}, data}) {
    if (Object.keys(query).length === 0) {
      return this.create(data)
    }
    else {
      return this.findOne(
        query
      ).then(res => {
        if (res) {
          return this.updateById({
            id: res._id,
            data
          })
        }
        else {
          return this.create(data)
        }
      })
    }
  }

  removeById(id) {
    return this.model.remove({_id: id})
  }

  removeAll() {
    return this.model.remove()
  }
}

module.exports = {
  Controller
}
