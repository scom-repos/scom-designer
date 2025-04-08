export const template = `
import { Module, customModule, Styles } from '@ijstech/components';
import ScomPageBlock from '@scom/page-block';
import ScomPageText from '@scom/page-text';
import ScomPageTextList from '@scom/page-text-list';
import ScomPageForm from '@scom/page-form';
import ScomPageButton from '@scom/page-button';
import ScomPageBlog from '@scom/page-blog';
import ScomPageBlogList from '@scom/page-blog-list';
import ScomPageBreadcrumb from '@scom/page-breadcrumb';
import ScomImage from '@scom/scom-image';
import ScomImageGallery from '@scom/scom-image-gallery';

@customModule
export default class Main extends Module {
  init() {
    super.init();
  }

  render() {
    return <i-panel width={'100%'} minHeight={'100%'}>
   </i-panel>
  }
}`;