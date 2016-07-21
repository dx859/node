class Observable {
    constructor() {
        this.m_obserSet = [];
    }

    /**
     * 添加观察者
     * @param {object} observer
     */
    addObser(observer) {
        this.m_obserSet.push(observer);
    }

    /**
     * 删除观察者
     * @param  {object} observer
     */
    removeObser(observer) {
        if (this.m_obserSet[observer]) {
            delete this.m_obserSet[observer];
        }
    }

    /**
     * 通知所有观察者
     */
    doAction() {
        console.log('Observable do some action：');
        this.notifyAllObser();
    }

    /**
     * 执行所有观察者的update方法
     */
    notifyAllObser() {
        for (var key in this.m_obserSet) {
            this.m_obserSet[key].update();
        }
    }
}

module.exports = Observable;
