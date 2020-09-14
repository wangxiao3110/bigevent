$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义加载文章分类的方法
    initCate()
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败')
                }
                // 调用模板引擎,渲染文章分类的下拉选项框
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //  点击选择封面，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click()
    })

    // 监听coverfile 的change事件，获取用户选择的文件列表
    $('#coverfile').on('change', function (e) {
        console.log(e);
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length == 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认重置行为
        e.preventDefault()
        // 2.基于表单，快速创建一个formData对象
        var fd = new FormData($(this)[0])  //必须是原生的dom对象才能拿到当前dom对象里所有name的值的
        // 3.将文章的发布状态存到fd中
        fd.append('state', art_state)
        // fd.forEach(function (a, b) {
        //     console.log(b, a);
        //   });

        // 4.将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 5.将文件存储到fd中
                fd.append('cover_img', blob)
                // 6.发起ajax请求
                publishArticle(fd)
            })
    })

    // 定义发表文章的方法
    function publishArticle(fd){
        $.ajax({
            type:'POST',
            url:'/my/article/add',
            data:fd,
            // 注意：如果向服务器提交的是FormData 格式的数据
            // 必须添加以下两个属性
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')

                // 发布文章成功之后。跳转到文章列表页面
                location.href='/article/art_list.html'
                // 侧边导航栏切换至art_list
                window.parent.
                console.log();
                        
            }
        })
    }


})