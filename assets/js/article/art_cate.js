$(function () {
    initArtCateList()

    var layer = layui.layer
    var form = layui.form

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 利用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
    // 为添加分类绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({   //layui的弹出层存在返回值，用来标识当前弹框
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html() //这里content是一个普通的String，传入html或dom元素都可以
        });
    })

    // 通过代理的形式为form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()  // 阻止表单默认提交行为
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()  // 重新刷新列表数据
                layer.msg('新增分类成功！')
                // 根据弹框的返回索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理为btn-edit 绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() //这里content是一个普通的String，传入html或dom元素都可以
        });

        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式为修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()  // 阻止表单默认提交行为
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }
                layer.msg('更新分类成功！')
                // 根据弹框的返回索引，关闭对应的弹出层
                layer.close(indexEdit)
                initArtCateList()  // 重新刷新列表数据
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        console.log(id);
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求获取对应分类的数据
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateList()  // 重新刷新列表数据
                }
            })
        });
    })








})